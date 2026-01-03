import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { deployApp, getDeployments } from "@/core/deployment";
import { Application } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);
  const { name, app }: { name: string; app: Application } = await req.json();

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (!name || !app) {
    return NextResponse.json(
      { message: "Body missing name, appId, nodeId" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const deployId = await deployApp(name, app);

  return NextResponse.json({
    message: "ok",
    deployId,
  });
}
