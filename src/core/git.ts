import simpleGit from "simple-git";
import fs from "fs";

export async function cloneRepo(repoUrl: string, deployPath: string) {
  fs.mkdirSync(deployPath, { recursive: true });
  const git = simpleGit();
  await git.clone(repoUrl, deployPath, ["--depth=1"]);
}
