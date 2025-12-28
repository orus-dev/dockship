import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { getDocker } from "@/core/docker";
import { Docker } from "@/lib/types";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const docker = await getDocker();

  return NextResponse.json({
    message: "ok",
    version: docker.version.Version,
    containers: docker.containers,
  } as Docker);
}
