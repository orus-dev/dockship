import { AuthorizationCode } from "simple-oauth2";

export const client = new AuthorizationCode({
  client: {
    id: process.env.GITHUB_CLIENT_ID!,
    secret: process.env.GITHUB_CLIENT_SECRET!,
  },
  auth: {
    tokenHost: "https://github.com",
    tokenPath: "/login/oauth/access_token",
    authorizePath: "/login/oauth/authorize",
  },
});
