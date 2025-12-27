"use server";

import axios from "axios";

export async function getDocker(
  node_ip: string,
  key: string
): Promise<{ version: string }> {
  return await (
    await axios.get(`http://${node_ip}:3000/api/get-docker`, {
      headers: { Authorization: `ApiKey ${key}` },
    })
  ).data;
}
