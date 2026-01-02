"use server";

import { client } from "@/core/auth/oauth";
import { redirect } from "next/navigation";

export default async function redirectAuth() {
  const authorizationUri = client.authorizeURL({
    redirect_uri: "http://localhost:3000/api/auth/callback",
    scope: "user:email",
    state: "random_state_string",
  });

  redirect(authorizationUri);
}
