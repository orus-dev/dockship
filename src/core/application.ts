"use server";

import { verifySession } from "./auth/session";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

const DATA_DIR = path.join(process.cwd(), "data", "apps");

export async function deployNewApp(name: string, repo: string, nodeId: string) {
  if (await verifySession()) {
    throw new Error("Unauthorized");
  }

  // Create app ID
  const appId = `app_${randomUUID()}`;
  const appDir = path.join(DATA_DIR, appId);
  const repoDir = path.join(appDir, "repo");

  // Create directories
  await fs.mkdir(repoDir, { recursive: true });

  // Write app.json
  const appConfig = {
    id: appId,
    name,
    repo,
    nodeId,
    createdAt: new Date().toISOString(),
  };

  await fs.writeFile(
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
    await fs.access(dockerfilePath);
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
