import { NextRequest, NextResponse } from "next/server";
import { version } from "../../../package.json";
import { read } from "./file";
import { randomUUID } from "crypto";

const TEMPLATE = { node_id: randomUUID() };

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { node_id } = await read(TEMPLATE, "data", "node.json");
  return NextResponse.json({ app: "dockship", version, node_id });
}
