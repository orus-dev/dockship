"use server";

import axios from "axios";
import { Node } from "@/lib/types";

export async function getDocker(node: Node): Promise<{ version: string }> {
  return await (
    await axios.get(`http://${node.ip}:3000/api/get-docker`, {
      headers: { Authorization: `ApiKey ${node.key}` },
    })
  ).data;
}
