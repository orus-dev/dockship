"use server";
import { read, write } from "@/app/api/file";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Users = Record<string, { roles: string[] }>;

export async function getSession(): Promise<
  undefined | { user: { id: number }; accessToken: string }
> {
  const c = await cookies();
  const accessToken = c.get("github_access")?.value;

  if (!accessToken) {
    redirect("/");
  }

  // Test the token
  try {
    const user = (
      await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    ).data;

    const users = Object.keys(
      await read<Users>(() => ({}), "data", "users.json")
    );

    if (!users.includes(String(user.id))) {
      if (users.length === 0) {
        await write(
          { [String(user.id)]: { roles: ["admin"] } } as Users, // First user is always an admin
          "data",
          "users.json"
        );
      } else {
        throw new Error("Invalid user");
      }
    }

    return { user, accessToken };
  } catch {
    redirect("/");
  }
}

export async function verifySession(): Promise<boolean> {
  return !(await getSession())?.accessToken;
}
