"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const c = await cookies();
  const accessToken = c.get("github_access")?.value;

  if (!accessToken) {
    redirect("/");
  }

  return accessToken;
}
