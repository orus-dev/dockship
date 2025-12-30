"use server";

import { Application } from "@/lib/types";
import Docker from "dockerode";

const docker = new Docker();

export async function getApplications(): Promise<Application[]> {
  const images = await docker.listImages();
  const containers = await docker.listContainers({ all: true });

  const apps: Application[] = [];

  for (const image of images) {
    const imageName = image.RepoTags?.[0];
    if (!imageName) continue;

    const relatedContainers = containers.filter((c) => c.Image === imageName);

    let totalCpu = 0;
    let totalMem = 0;
    let running = 0;
    const ports = new Set<string>();

    for (const containerInfo of relatedContainers) {
      const container = docker.getContainer(containerInfo.Id);

      if (containerInfo.State === "running") running++;

      containerInfo.Ports?.forEach((p) => {
        if (p.PublicPort && p.PrivatePort) {
          ports.add(`${p.PublicPort}:${p.PrivatePort}`);
        }
      });

      if (containerInfo.State === "running") {
        const stats = await container.stats({ stream: false });
      }
    }

    apps.push({
      id: image.Id.slice(7, 15),
      name: imageName.split("/").pop()?.split(":")[0] ?? imageName,
      image: imageName,
      containers: relatedContainers.length,
      replicas: `${running}/${relatedContainers.length}`,
      cpu: Math.round(totalCpu),
      memory: Math.round(totalMem),
      network: "—",
      status: running > 0 ? ("running" as const) : ("stopped" as const),
      ports: [...ports],
    });
  }

  return apps;
}
