"use server";

import Docker from "dockerode";
import { Application, Deployment } from "@/lib/types";
import { CPUusage } from "@/lib/server/calc";
import path from "path";
import fs from "fs";
import pLimit from "p-limit";

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
): Promise<Deployment[]> {
  const limit = pLimit(5);

  const deploymentIds = apps.flatMap((app) => app.deployments);

  const results = await Promise.all(
    deploymentIds.map((deployId) =>
      limit(async (): Promise<Deployment | null> => {
        try {
          const container = docker.getContainer(deployId);
          const containerInfo = await container.inspect();

          let cpu = 0;
          let memory = 0;

          // Use Map to deduplicate ports reliably
          const ports = new Map<number, number>();

          if (containerInfo.State?.Running) {
            const stats = await container.stats({ stream: false });

            const usage = stats.memory_stats?.usage ?? 0;
            const limitMem = stats.memory_stats?.limit ?? 0;

            if (limitMem > 0) {
              memory = (usage / limitMem) * 100;
            }

            cpu = CPUusage(stats);
          }

          const portMappings = containerInfo.NetworkSettings?.Ports ?? {};

          for (const [key, mappings] of Object.entries(portMappings)) {
            if (!mappings) continue;

            const privatePort = Number.parseInt(key.split("/")[0], 10);

            for (const mapping of mappings) {
              const publicPort = Number.parseInt(mapping.HostPort, 10);

              if (!Number.isNaN(publicPort) && !Number.isNaN(privatePort)) {
                ports.set(publicPort, privatePort);
              }
            }
          }

          return {
            image: containerInfo.Image,
            container: containerInfo.Id,
            cpu,
            memory,
            status: containerInfo.State?.Running ? "running" : "stopped",
            ports: [...ports.entries()].map(
              ([publicPort, privatePort]) =>
                [publicPort, privatePort] as [number, number]
            ),
          };
        } catch {
          // Container may have stopped / been removed
          return null;
        }
      })
    )
  );

  // Remove failed containers
  return results.filter(
    (deployment: any): deployment is Deployment => deployment !== null
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
