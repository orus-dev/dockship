"use server";

import { verifySession } from "../../core/auth/session";
import { getNodes } from "@/lib/dockship/node";
import axios from "axios";
import { Env, EnvVariable, Application } from "@/lib/types";
import { read, write } from "@/app/api/file";

export async function installApp(name: string, repo: string, nodeId: string) {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  const nodes = await getNodes();

  const targetNode = nodes.find((node) => node.node_id === nodeId);

  return await (
    await axios.post(
      `http://${targetNode?.ip}:3000/api/applications`,
      { name, repo, nodeId },
      {
        headers: { Authorization: `ApiKey ${targetNode?.key}` },
      }
    )
  ).data.applications;
}

export async function getApplications(): Promise<Application[]> {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  return read(() => [], "data", "apps.json");
}

export async function getEnv(): Promise<Record<string, Env>> {
  const apps = await getApplications();

  return apps.reduce<Record<string, Env>>((acc, app) => {
    acc[app.id] = {
      id: app.id,
      name: app.name,
      variables: app.env,
    };

    return acc;
  }, {});
}

export async function setEnv(
  appId: string,
  variables: Record<string, EnvVariable>
) {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  const apps = await getApplications();
  const app = apps.find((app) => app.id === appId);
  if (!app) throw new Error("App not found");
  editApp(appId, { ...app, env: variables });
}

export async function removeApp(appId: string) {
  const apps = await getApplications();

  const nextApps = apps.filter((app) => app.id !== appId);

  await write(nextApps, "data", "apps.json");
}

export async function editApp(appId: string, updatedApp: Application) {
  const apps = await getApplications();

  const nextApps = apps.map((app) => (app.id === appId ? updatedApp : app));

  await write(nextApps, "data", "apps.json");
}
