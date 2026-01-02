"use server";
import { read, write } from "@/app/api/file";
import axios from "axios";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Users = Record<string, { roles: string[] }>;

export async function getSession(): Promise<
  undefined | { userId: string; accessToken: string }
> {
  const c = await cookies();
  const accessToken = c.get("github_access")?.value;

  if (!accessToken) {
    redirect("/");
  }

  const tokens: Record<string, string> = await read(
    () => ({}),
    "data",
    "sessions.json"
  );

  const tokenHash = createHash("sha256").update(accessToken).digest("hex");

  try {
    const userId: string =
      tokens[tokenHash] ||
      (
        await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      ).data.id;

    // Test the token
    const users = Object.keys(
      await read<Users>(() => ({}), "data", "users.json")
    );

    if (!users.includes(String(userId))) {
      if (users.length === 0) {
        await write(
          { [userId]: { roles: ["admin"] } } as Users, // First user is always an admin
          "data",
          "users.json"
        );
      } else {
        throw new Error("Invalid user");
      }
    }

    await write({ ...tokens, [tokenHash]: userId }, "data", "sessions.json");

    return { userId, accessToken };
  } catch {
    redirect("/");
  }
}

export async function verifySession(): Promise<boolean> {
  return !(await getSession())?.accessToken;
}
