import { NextRequest, NextResponse } from "next/server";
import { version } from "@/../package.json";
import { read } from "@/app/api/file";
import { NodeJsonTemplate } from "@/app/api/types";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { node_id } = await read(NodeJsonTemplate, "data", "node.json");

  return NextResponse.json({ app: "dockship", version, node_id });
}
