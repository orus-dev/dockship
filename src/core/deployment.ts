"use server";

import Docker from "dockerode";
import { Application, Deployment } from "@/lib/types";
import { CPUusage } from "@/lib/server/calc";
import path from "path";
import fs from "fs";

const docker = new Docker();

function sanitizeString(str: string): string {
  if (!str) return "";
  return (
    str[0].replace(/[^a-zA-Z0-9]/g, "-") +
    str.slice(1).replace(/[^a-zA-Z0-9_.-]/g, "-")
  );
}

export async function getDeployments(
  apps: Application[]
): Promise<(null | Deployment)[]> {
  return await Promise.all(
    apps
      .map((app) => app.deployments)
      .flat()
      .map(async (deployId) => {
        const container = docker.getContainer(deployId);
        const containerInfo = await container.inspect();

        let cpu = 0;
        let memory = 0;
        let ports: Set<[number, number]> = new Set();

        if (containerInfo.State.Running) {
          const stats = await container.stats({ stream: false });
          memory += (stats.memory_stats.usage / stats.memory_stats.limit) * 100;
          cpu += CPUusage(stats);
        }

        for (const [key, mappings] of Object.entries(
          containerInfo.NetworkSettings.Ports
        )) {
          const privatePort = parseInt(key.split("/")[0], 10);
          if (mappings) {
            for (const mapping of mappings) {
              const publicPort = parseInt(mapping.HostPort, 10);
              ports.add([publicPort, privatePort]);
            }
          }
        }

        return {
          image: containerInfo.Image,
          container: containerInfo.Id,
          cpu,
          memory,
          status: containerInfo.State.Running ? "running" : "stopped",
          ports: [...ports],
        };
      })
  );
}

export async function deployApp(
  name: string,
  appId: string
): Promise<string | undefined> {
  const appPath = path.join("data", "apps", appId, "repo");
  const imageTag = `dockship/${appId}:latest`;

  try {
    // Check if app exists
    fs.accessSync(appPath);
  } catch {
    console.error("Repo does not exist:", appPath);
    return undefined;
  }

  try {
    const stream = await docker.buildImage(
      {
        context: appPath,
        src: ["Dockerfile", "."],
      },
      { t: imageTag }
    );

    await new Promise<void>((resolve, reject) => {
      docker.modem.followProgress(stream, (err: Error | null) =>
        err ? reject(err) : resolve()
      );
    });

    const container = await docker.createContainer({
      Image: imageTag,
      name: sanitizeString(name),
      Tty: true,
      HostConfig: {
        RestartPolicy: { Name: "unless-stopped" },
        PortBindings: {
          "3000/tcp": [{ HostPort: "3800" }],
        },
      },
    });

    await container.start();

    return container.id;
  } catch (err) {
    console.error("Failed to deploy app:", err);
    return undefined;
  }
}
