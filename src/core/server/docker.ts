"use server";

import Docker from "dockerode";

const docker = new Docker();

export async function getDocker() {
  const version = await docker.version();
  const containers = await docker.listContainers();
  return { version, containers };
}
