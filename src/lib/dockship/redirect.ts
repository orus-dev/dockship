"use server";

import { client } from "@/core/auth/oauth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function redirectAuth() {
  // Get headers of the incoming request
  const hdrs = await headers();

  // Get protocol and host
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || "http";

  const baseUrl = `${proto}://${host}`;

  const authorizationUri = client.authorizeURL({
    redirect_uri: `${baseUrl}/api/auth/callback`,
    scope: "user:email",
    state: "random_state_string",
  });

  redirect(authorizationUri);
}
