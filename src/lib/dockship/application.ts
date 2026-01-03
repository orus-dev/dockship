"use server";

import { verifySession } from "../../core/auth/session";
import { Env, EnvVariable, Application } from "@/lib/types";
import { read, write } from "@/app/api/file";
import { randomUUID } from "crypto";

export async function getApps(): Promise<Application[]> {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  return read(() => [], "data", "apps.json");
}

export async function registerApp(name: string, repo: string) {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  const app: Application = {
    id: randomUUID(),
    name,
    repo,
    createdAt: new Date().toISOString(),
    deployments: [],
    env: {},
  };

  await write([...(await getApps()), app], "data", "apps.json");

  return app;
}

export async function removeApp(appId: string) {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  const apps = await getApps();

  const nextApps = apps.filter((app) => app.id !== appId);

  await write(nextApps, "data", "apps.json");
}

export async function editApp(appId: string, updatedApp: Application) {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  const apps = await getApps();

  const nextApps = apps.map((app) => (app.id === appId ? updatedApp : app));

  await write(nextApps, "data", "apps.json");
}

export async function getEnv(): Promise<Record<string, Env>> {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  const apps = await getApps();

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

  const apps = await getApps();
  const app = apps.find((app) => app.id === appId);
  if (!app) throw new Error("App not found");
  editApp(appId, { ...app, env: variables });
}
