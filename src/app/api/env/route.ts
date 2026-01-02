import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import { getEnv, setEnv } from "@/core/application";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  return NextResponse.json(await getEnv());
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const { appId, variables } = await req.json();

  if (!appId || !variables) {
    return NextResponse.json(
      { message: "Missing appId, variables in body" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  await setEnv(appId, variables);

  return NextResponse.json({ message: "ok", success: true });
}
