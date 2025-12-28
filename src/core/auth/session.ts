import { getIronSession } from "iron-session";

export const session = getIronSession({
  password: process.env.SESSION_PASSWORD!,
  cookieName: "nextjs_oauth_session",
  secure: process.env.NODE_ENV === "production",
});
