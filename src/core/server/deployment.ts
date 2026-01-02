"use server";

import Docker from "dockerode";
import { Application, Deployment } from "@/lib/types";
import { CPUusage } from "@/lib/server/calc";

const docker = new Docker();

export async function getDeployments(
  apps: Application[]
): Promise<(null | Deployment)[]> {
  const containers = await docker.listContainers({ all: true });

  return await Promise.all(
    apps
      .map((app) => app.deployments)
      .flat()
      .map(async (imageId) => {
        const containerInfo = containers.find(
          (container) => container.ImageID === imageId
        );

        if (!containerInfo) return null;

        const container = docker.getContainer(containerInfo.Id);

        let cpu = 0;
        let memory = 0;
        let ports: Set<[number, number]> = new Set();

        if (containerInfo.State === "running") {
          const stats = await container.stats({ stream: false });
          memory += (stats.memory_stats.usage / stats.memory_stats.limit) * 100;
          cpu += CPUusage(stats);
        }

        containerInfo.Ports?.forEach((p) => {
          if (p.PublicPort && p.PrivatePort) {
            ports.add([p.PublicPort, p.PrivatePort]);
          }
        });

        return {
          image: containerInfo.ImageID,
          container: containerInfo.Id,
          cpu,
          memory,
          status: containerInfo.State === "running" ? "running" : "stopped",
          ports: [...ports],
        };
      })
  );
}
