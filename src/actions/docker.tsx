"use server";

import Docker from "dockerode";

const docker = new Docker();

export async function getDocker() {
  const version = await docker.version();
  console.log("Docker version:", version);
  return version;
}
