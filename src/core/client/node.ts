"use server";

import { read, write } from "@/app/api/file";
import { Node, NodeLiveData } from "@/lib/types";
import axios from "axios";

export async function getNodes(): Promise<Node[]> {
  return await read(() => [], "data", "nodes.json");
}

export async function setNodes(nodes: Node[]) {
  await write(nodes, "data", "nodes.json");
}

export async function getNode(node_id: string): Promise<Node | undefined> {
  const nodes = await read<Node[]>(() => [], "data", "nodes.json");
  return nodes.find((v) => v.node_id === node_id);
}

export async function getLiveNodes(): Promise<(NodeLiveData & Node)[]> {
  const nodes = await read(() => [], "data", "nodes.json");
  return await Promise.all(nodes.map(getLiveNode));
}

export async function getLiveNode(node: Node): Promise<NodeLiveData & Node> {
  const data = await (
    await axios.get(`http://${node.ip}:3000/api/status`, {
      headers: { Authorization: `ApiKey ${node.key}` },
    })
  ).data;
  return { ...node, liveData: data.liveData };
}
