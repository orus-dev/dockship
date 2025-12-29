"use server";

import axios from "axios";
import { Docker, Node } from "@/lib/types";
import { verifySession } from "./auth/session";

export async function getDocker(nodes: Node[]): Promise<Docker[]> {
  if (await verifySession()) return [];

  return await Promise.all(
    nodes.map(async (node) => {
      const data = await (
        await axios.get(`http://${node.ip}:3000/api/get-docker`, {
          headers: { Authorization: `ApiKey ${node.key}` },
        })
      ).data;

      return { ...node, containers: data.containers, version: data.version };
    })
  );
}
