import { NextRequest, NextResponse } from "next/server";
import { version } from "@/../package.json";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { read } from "@/app/api/file";
import { NodeJsonTemplate } from "../types";
import osName from "os-name";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const { node_id } = await read(NodeJsonTemplate, "data", "node.json");

  return NextResponse.json({
    message: "ok",
    app: "dockship",
    version,
    node_id,
    os: osName(),
  });
}
