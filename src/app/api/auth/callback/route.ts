import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No code provided" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = response.data.access_token;

    const c = await cookies();
    c.set("github_access", accessToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.redirect(new URL("/overview", request.url));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error exchanging code for access token" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
