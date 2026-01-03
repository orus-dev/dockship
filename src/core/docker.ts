"use server";

import { CPUusage } from "@/lib/server/calc";
import { Log, SimpleStats } from "@/lib/types";
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
  const container = docker.getContainer(containerId);

  const data = await container.inspect();

  if (!data.State.Running) {
    return;
  }

  const stats = await container.stats({ stream: false });

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

function inferLevel(message: string): "info" | "warn" | "error" {
  const msg = message.toLowerCase();

  if (msg.includes("error") || msg.includes("fatal")) return "error";
  if (msg.includes("warn")) return "warn";

  return "info";
}

function demuxLogs(buffer: Buffer): string {
  let offset = 0;
  let output = "";

  while (offset < buffer.length) {
    const streamType = buffer[offset];
    const length = buffer.readUInt32BE(offset + 4);
    offset += 8;

    output += buffer.slice(offset, offset + length).toString("utf8");
    offset += length;
  }

  return output;
}
async function getContainerLogs(
  containerId: string,
  name: string
): Promise<Log[]> {
  const container = docker.getContainer(containerId);

  // Inspect the container to check the logging driver
  const info = await container.inspect();
  const driver = info.HostConfig.LogConfig?.Type;

  if (driver !== "json-file" && driver !== "journald") {
    // Skip containers with unsupported logging drivers
    return [];
  }

  try {
    const raw = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: true,
    });

    const text = demuxLogs(raw);

    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const firstSpace = line.indexOf(" ");
        const timestamp = line.slice(0, firstSpace);
        const message = line.slice(firstSpace + 1);

        return {
          timestamp,
          level: inferLevel(message),
          source: name,
          message,
        } satisfies Log;
      });
  } catch (err: any) {
    if (err.statusCode === 501) {
      // Logging driver does not support reading
      return [];
    }
    throw err; // rethrow any other error
  }
}

export async function getAllContainerLogs(): Promise<Log[]> {
  const containers = await docker.listContainers({ all: true });

  const logs = await Promise.all(
    containers.map((c) => getContainerLogs(c.Id, c.Names[0].replace("/", "")))
  );

  return logs
    .flat()
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
}
