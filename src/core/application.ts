"use server";

import { verifySession } from "./auth/session";
import { getNodes } from "./node";
import axios from "axios";
import { Env, ImageApp } from "@/lib/types";

export async function deployNewApp(name: string, repo: string, nodeId: string) {
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

export async function getApplications(): Promise<ImageApp[]> {
  const nodes = await getNodes();

  return (
    await Promise.all(
      nodes.map(
        async (n) =>
          await (
            await axios.get(`http://${n.ip}:3000/api/applications`, {
              headers: { Authorization: `ApiKey ${n.key}` },
            })
          ).data.applications
      )
    )
  ).flat();
}

export async function getEnv(): Promise<Record<string, Env[]>> {
  const nodes = await getNodes();

  const envRecords = await Promise.all(
    nodes.map(async (n) => {
      const response = await axios.get(`http://${n.ip}:3000/api/env`, {
        headers: { Authorization: `ApiKey ${n.key}` },
      });
      return response.data as Record<string, Env[]>;
    })
  );

  const merged: Record<string, Env[]> = Object.assign({}, ...envRecords);

  return merged;
}
