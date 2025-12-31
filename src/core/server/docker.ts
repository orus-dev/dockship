"use server";

import { CPUusage } from "@/lib/server/calc";
import { SimpleStats } from "@/lib/types";
import Docker from "dockerode";

const docker = new Docker();

export async function getDocker() {
  const version = await docker.version();
  const containers = await docker.listContainers({ all: true });
  return { version, containers };
}

export async function getContainerStats(
  containerId: string
): Promise<SimpleStats | undefined> {
  const stats = await docker.getContainer(containerId).stats({ stream: false });

  return {
    cpu: CPUusage(stats),
    memory: (stats.memory_stats.usage / stats.memory_stats.limit) * 100,
  };
}

export async function startContainer(containerId: string) {
  await docker.getContainer(containerId).start();
}

export async function stopContainer(containerId: string) {
  await docker.getContainer(containerId).stop();
}

export async function removeContainer(containerId: string) {
  await docker.getContainer(containerId).remove();
}
