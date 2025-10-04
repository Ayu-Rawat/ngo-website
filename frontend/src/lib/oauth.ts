import { Google } from "arctic";

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const redirectUri = `${baseUrl}/login/google/callback`;

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri
);

export { redirectUri };
