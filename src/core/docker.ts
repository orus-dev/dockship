"use server";

import axios from "axios";
import { Docker, Node } from "@/lib/types";
import { verifySession } from "./auth/session";
import { ContainerStats } from "dockerode";
import { getNodes } from "./node";

export async function getDocker(nodes: Node[]): Promise<Docker[]> {
  if (await verifySession()) return [];

  return await Promise.all(
    nodes.map(async (node) => {
      const data = await (
        await axios.get(`http://${node.ip}:3000/api/container/`, {
          headers: { Authorization: `ApiKey ${node.key}` },
        })
      ).data;

      return { ...node, containers: data.containers, version: data.version };
    })
  );
}

export async function getContainerStats(
  containerId: string
): Promise<ContainerStats | undefined> {
  const nodes = await getNodes();

  return (
    await Promise.all(
      nodes.map(
        async (n) =>
          await (
            await axios.get(`http://${n.ip}:3000/api/container/stats`, {
              headers: { Authorization: `ApiKey ${n.key}` },
              params: { containerId },
            })
          ).data
      )
    )
  ).find((s) => s);
}

export async function startContainer(containerId: string) {
  const nodes = await getNodes();

  nodes.forEach(
    async (n) =>
      await (
        await axios.post(
          `http://${n.ip}:3000/api/container/start`,
          { containerId },
          {
            headers: { Authorization: `ApiKey ${n.key}` },
            params: { containerId },
          }
        )
      ).data
  );
}

export async function stopContainer(containerId: string) {
  const nodes = await getNodes();

  nodes.forEach(
    async (n) =>
      await (
        await axios.delete(`http://${n.ip}:3000/api/container/start`, {
          headers: { Authorization: `ApiKey ${n.key}` },
          params: { containerId },
        })
      ).data
  );
}

export async function removeContainer(containerId: string) {
  const nodes = await getNodes();

  nodes.forEach(
    async (n) =>
      await (
        await axios.delete(`http://${n.ip}:3000/api/container`, {
          headers: { Authorization: `ApiKey ${n.key}` },
          params: { containerId },
        })
      ).data
  );
}
