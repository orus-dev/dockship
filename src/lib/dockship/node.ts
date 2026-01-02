"use server";

import { read, write } from "@/app/api/file";
import { Node, NodeLiveData } from "@/lib/types";
import axios from "axios";
import { verifySession } from "../../core/auth/session";

export async function getNodes(): Promise<Node[]> {
  if (await verifySession()) return [];

  return await read(() => [], "data", "nodes.json");
}

export async function setNodes(nodes: Node[]) {
  if (await verifySession()) return;

  await write(nodes, "data", "nodes.json");
}

export async function getLiveNodes(): Promise<(NodeLiveData & Node)[]> {
  if (await verifySession()) return [];

  const nodes: Node[] = await read(() => [], "data", "nodes.json");

  return await Promise.all(
    nodes.map(async (node) => ({
      ...node,
      liveData: await (
        await axios.get(`http://${node.ip}:3000/api/status`, {
          headers: { Authorization: `ApiKey ${node.key}` },
        })
      ).data.liveData,
    }))
  );
}

export async function authNode(ip: string, key: string) {
  if (await verifySession()) return;

  const data = await (
    await axios.get(`http://${ip}:3000/api/auth`, {
      headers: { Authorization: `ApiKey ${key}` },
    })
  ).data;

  return { version: data.version, node_id: data.node_id, os: data.os };
}
