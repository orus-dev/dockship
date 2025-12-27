import { NextRequest, NextResponse } from "next/server";
import { version } from "@/../package.json";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  return NextResponse.json({
    message: "ok",
    app: "dockship",
    version,
  });
}
