import { read } from "@/app/api/file";
import { NodeJsonTemplate } from "@/app/api/types";
import { NextRequest } from "next/server";

export default async function testAuth(
  req: NextRequest
): Promise<null | string> {
  const auth = req.headers.get("Authorization")?.replaceAll("ApiKey", "");

  if (!auth)
    return "Missing Authorization header (Authorization: ApiKey <key>)";

  const { key } = await read(NodeJsonTemplate, "data", "node.json");

  if (key !== auth) return "Invalid key";

  return null;
}
