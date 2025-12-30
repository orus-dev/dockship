import { NextRequest, NextResponse } from "next/server";
import testAuth from "../../auth";
import { StatusCodes } from "http-status-codes";
import { startContainer, stopContainer } from "@/core/server/docker";

export async function POST(req: NextRequest): Promise<NextResponse> {
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

  await startContainer(id);

  return NextResponse.json({
    message: "ok",
  });
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

  await stopContainer(id);

  return NextResponse.json({
    message: "ok",
  });
}
