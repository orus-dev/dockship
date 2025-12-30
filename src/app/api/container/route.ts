import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { getDocker, removeContainer } from "@/core/server/docker";
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

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);
  const id = req.nextUrl.searchParams.get("containerId");

  if (!id) {
    return NextResponse.json(
      { message: "Invalid containerId param" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  await removeContainer(id);

  return NextResponse.json({
    message: "ok",
  });
}
