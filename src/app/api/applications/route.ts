import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { getApplications } from "@/core/server/application";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const applications = await getApplications();

  return NextResponse.json({
    message: "ok",
    applications,
  });
}
