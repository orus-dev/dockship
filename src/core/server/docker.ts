"use server";

import Docker, { ContainerStats } from "dockerode";

const docker = new Docker();

export async function getDocker() {
  const version = await docker.version();
  const containers = await docker.listContainers({ all: true });
  return { version, containers };
}

export async function getContainerStats(
  containerId: string
): Promise<ContainerStats | undefined> {
  return await (await docker.getContainer(containerId)).stats();
}

export async function startContainer(containerId: string) {
  await docker.getContainer(containerId).start();
}

export async function stopContainer(containerId: string) {
  await docker.getContainer(containerId).stop();
}
