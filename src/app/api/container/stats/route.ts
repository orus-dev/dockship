import { NextRequest, NextResponse } from "next/server";
import testAuth from "../../auth";
import { StatusCodes } from "http-status-codes";
import { getContainerStats } from "@/core/server/docker";

export async function GET(req: NextRequest): Promise<NextResponse> {
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

  const stats = await getContainerStats(id);

  return NextResponse.json({
    message: "ok",
    stats: {
      cpu_stats: stats?.cpu_stats,
      memory_stats: stats?.memory_stats,
    },
  });
}
