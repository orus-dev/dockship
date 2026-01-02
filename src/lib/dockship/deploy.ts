"use server";

import { Deployment } from "@/lib/types";
import { getNodes } from "./node";
import axios from "axios";

export async function getDeployments(): Promise<(null | Deployment)[]> {
  const nodes = await getNodes();

  return (
    await Promise.all(
      nodes.map(
        async (n) =>
          await (
            await axios.get(`http://${n.ip}:3000/api/deploy`, {
              headers: { Authorization: `ApiKey ${n.key}` },
            })
          ).data.applications
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

  return await (
    await axios.post(
      `http://${node.ip}:3000/api/deploy`,
      { name, appId },
      {
        headers: { Authorization: `ApiKey ${node.key}` },
      }
    )
  ).data.deployId;
}
