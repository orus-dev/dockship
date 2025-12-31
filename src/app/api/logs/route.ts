import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { getAllContainerLogs } from "@/core/server/docker";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  return NextResponse.json(await getAllContainerLogs());
}
