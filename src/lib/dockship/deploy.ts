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
