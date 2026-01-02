"use server";

import Docker from "dockerode";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import { Application, Env, EnvVariable } from "@/lib/types";

const docker = new Docker();
const execAsync = util.promisify(exec);
const DATA_DIR = path.join(process.cwd(), "data", "apps");

export async function getApplications(): Promise<Application[]> {
  return fs
    .readdirSync(DATA_DIR)
    .map((appId) =>
      JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, appId, "app.json")).toString()
      )
    );
}

export async function installApp(name: string, repo: string, nodeId: string) {
  // Create app ID
  const appId = `app_${randomUUID()}`;
  const appDir = path.join(DATA_DIR, appId);
  const repoDir = path.join(appDir, "repo");

  // Create directories
  fs.mkdirSync(repoDir, { recursive: true });

  // Write app.json
  const appConfig: Application = {
    id: appId,
    name,
    repo,
    nodeId,
    createdAt: new Date().toISOString(),
    deployments: [],
  };

  fs.writeFileSync(
    path.join(appDir, "app.json"),
    JSON.stringify(appConfig, null, 2)
  );

  // Write env.json
  fs.writeFileSync(path.join(appDir, "env.json"), JSON.stringify([], null, 2));

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
    fs.rmSync(appDir, { recursive: true });
    throw new Error("Dockerfile not found in repository root");
  }

  return {
    success: true,
    appId,
  };
}

export async function getEnv(): Promise<Record<string, Env>> {
  const apps = fs.readdirSync(DATA_DIR);

  return apps.reduce((acc, appId) => {
    const appPath = path.join(DATA_DIR, appId, "app.json");
    const name = JSON.parse(fs.readFileSync(appPath).toString()).name;

    const envPath = path.join(DATA_DIR, appId, "env.json");
    if (fs.existsSync(envPath)) {
      const envData: Record<string, EnvVariable> = JSON.parse(
        fs.readFileSync(envPath, "utf-8")
      );
      acc[appId] = { variables: envData, id: appId, name };
    }
    return acc;
  }, {} as Record<string, Env>);
}

export async function setEnv(appId: string, variables: EnvVariable[]) {
  const apps = fs.readdirSync(DATA_DIR);

  apps.forEach((id) => {
    if (id === appId) {
      const envPath = path.join(DATA_DIR, appId, "env.json");

      fs.writeFileSync(envPath, JSON.stringify(variables));
    }
  });
}

export async function removeApp(appId: string) {
  const appPath = path.join(DATA_DIR, appId);

  const appMeta: Application = JSON.parse(
    fs.readFileSync(path.join(appPath, "app.json")).toString()
  );

  appMeta.deployments.forEach(async (imgId) => {
    // Remove containers
    (await docker.listContainers({ all: true }))
      .filter((con) => con.ImageID === imgId)
      .forEach((con) => {
        const container = docker.getContainer(con.Id);
        container.stop();
        container.remove();
      });

    // Remove image
    const image = docker.getImage(imgId);
    image.remove();
  });

  fs.rmSync(appPath, { recursive: true });
}
