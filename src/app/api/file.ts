import { promises as fs } from "fs";
import path from "path";

export async function read<T extends object>(
  template: T,
  fp: string,
  ...filePaths: string[]
): Promise<T> {
  const filePath = path.join(process.cwd(), fp, ...filePaths);
  const dirPath = path.dirname(filePath);

  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(template, null, 2), "utf-8");
  }

  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}
