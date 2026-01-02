import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { installApp, getApplications, removeApp } from "@/core/application";

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

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);
  const { name, repo, nodeId }: { name: string; repo: string; nodeId: string } =
    await req.json();

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (!name || !repo || !nodeId) {
    return NextResponse.json(
      { message: "Body missing name, repo, nodeId" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const res = await installApp(name, repo, nodeId);

  return NextResponse.json({
    message: "ok",
    ...res,
  });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);
  const appId = req.nextUrl.searchParams.get("appId");

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (!appId) {
    return NextResponse.json(
      { message: "Missing param appId" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  await removeApp(appId);

  return NextResponse.json({
    message: "ok",
  });
}
