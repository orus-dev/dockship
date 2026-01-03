"use server";

import { Deployment } from "@/lib/types";
import { getNodes } from "./node";
import axios from "axios";
import { editApp, getApp, getApps } from "./application";

export async function getDeployments(): Promise<(null | Deployment)[]> {
  const nodes = await getNodes();
  const apps = await getApps();

  return (
    await Promise.all(
      nodes.map(
        async (n) =>
          await (
            await axios.post(`http://${n.ip}:3000/api/get-deployments`, apps, {
              headers: { Authorization: `ApiKey ${n.key}` },
            })
          ).data.apps
      )
    )
  ).flat();
}

export async function deployApp(
  name: string,
  appId: string,
  nodeId: string
): Promise<string | undefined> {
  const nodes = await getNodes();

  const node = nodes.find((n) => n.node_id === nodeId);

  if (!node) throw new Error("Node not found");

  const deployId = await (
    await axios.post(
      `http://${node.ip}:3000/api/deploy`,
      { name, appId },
      {
        headers: { Authorization: `ApiKey ${node.key}` },
      }
    )
  ).data.deployId;

  const app = await getApp(appId);
  if (!app) throw new Error("(deployId) App not found");

  app.deployments.push(deployId);

  editApp(appId, app);

  return deployId;
}
