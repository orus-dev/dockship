import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { deployApp, getDeployments } from "@/core/deployment";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  // const apps = await getApps();

  const apps = await getDeployments([]);

  return NextResponse.json({
    message: "ok",
    apps,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);
  const { name, appId }: { name: string; appId: string } = await req.json();

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (!name || !appId) {
    return NextResponse.json(
      { message: "Body missing name, appId, nodeId" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const deployId = await deployApp(name, appId);

  return NextResponse.json({
    message: "ok",
    deployId,
  });
}
