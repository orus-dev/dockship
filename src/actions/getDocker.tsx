"use server";

import Docker from "dockerode";

export default async function getDocker() {
  var docker = new Docker();
  let version = await docker.version();
  console.log('Docker version:', version);
}
