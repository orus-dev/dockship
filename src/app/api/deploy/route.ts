import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { getDeployments } from "@/core/deployment";
import { getApplications } from "@/core/application";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const apps = await getApplications();

  const applications = await getDeployments(apps);

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
