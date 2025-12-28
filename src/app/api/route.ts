import { NextRequest, NextResponse } from "next/server";
import { version } from "@/../package.json";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ app: "dockship", version });
}
