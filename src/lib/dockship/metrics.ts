"use server";

import { Node } from "@/lib/types";
import axios from "axios";
import { getNodes } from "./node";

export async function getMetrics(): Promise<
  {
    time: string;
    cpu: number;
    memory: number;
    in: number;
    out: number;
  }[]
> {
  const nodes = await getNodes();
  const nodeMetrics = await Promise.all(nodes.map(getNodeMetrics));

  if (nodeMetrics.length === 0) return [];

  const numNodes = nodeMetrics.length;
  const numPoints = nodeMetrics[0].length;

  const averaged: (typeof nodeMetrics)[0] = [];

  for (let i = 0; i < numPoints; i++) {
    const sum = nodeMetrics.reduce(
      (acc, metrics) => {
        const m = metrics[i];
        acc.cpu += m.cpu;
        acc.memory += m.memory;
        acc.in += m.in;
        acc.out += m.out;
        return acc;
      },
      { cpu: 0, memory: 0, in: 0, out: 0 }
    );

    averaged.push({
      time: nodeMetrics[0][i].time,
      cpu: sum.cpu / numNodes,
      memory: sum.memory / numNodes,
      in: sum.in / numNodes,
      out: sum.out / numNodes,
    });
  }

  return averaged;
}

export async function getNodeMetrics(node: Node): Promise<
  {
    time: string;
    cpu: number;
    memory: number;
    in: number;
    out: number;
  }[]
> {
  const data = await (
    await axios.get(`http://${node.ip}:3000/api/metrics`, {
      headers: { Authorization: `ApiKey ${node.key}` },
    })
  ).data;

  return data.metrics;
}
