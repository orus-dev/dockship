"use server";

import Docker from "dockerode";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import { ImageApp } from "@/lib/types";

const docker = new Docker();
const execAsync = util.promisify(exec);
const DATA_DIR = path.join(process.cwd(), "data", "apps");

export async function getApplications(): Promise<ImageApp[]> {
  const images = await docker.listImages();
  const containers = await docker.listContainers({ all: true });

  const apps: ImageApp[] = [];

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

    const name = imageName.split("/").pop()?.split(":")[0] ?? imageName;

    var app;

    try {
      app = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, name, "app.json")).toString()
      );
    } catch {}

    apps.push({
      app,
      name,
      id: image.Id.slice(7, 15),
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

export async function deployNewApp(name: string, repo: string, nodeId: string) {
  // Create app ID
  const appId = `app_${randomUUID()}`;
  const appDir = path.join(DATA_DIR, appId);
  const repoDir = path.join(appDir, "repo");

  // Create directories
  fs.mkdirSync(repoDir, { recursive: true });

  // Write app.json
  const appConfig = {
    id: appId,
    name,
    repo,
    nodeId,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(appDir, "app.json"),
    JSON.stringify(appConfig, null, 2)
  );

  // Clone repository
  try {
    await execAsync(`git clone ${repo} ${repoDir}`);
  } catch (err) {
    throw new Error("Failed to clone repository");
  }

  // Validate Dockerfile
  const dockerfilePath = path.join(repoDir, "Dockerfile");

  try {
    fs.accessSync(dockerfilePath);
  } catch {
    throw new Error("Dockerfile not found in repository root");
  }

  const imageTag = `dockship/${appId}:latest`;

  try {
    await execAsync(`docker build -t ${imageTag} .`, {
      cwd: repoDir,
    });
  } catch {
    throw new Error("Docker build failed");
  }

  return {
    success: true,
    appId,
    image: imageTag,
  };
}
