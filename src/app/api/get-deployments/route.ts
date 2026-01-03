import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { deployApp, getDeployments } from "@/core/deployment";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);
  const apps = await req.json();

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (!apps)
    return NextResponse.json(
      { message: "Body should be Application[]" },
      { status: StatusCodes.UNAUTHORIZED }
    );

  const deployments = await getDeployments(apps);

  return NextResponse.json({
    message: "ok",
    deployments,
  });
}
