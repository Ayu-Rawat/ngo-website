import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  const store = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  
  store.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    maxAge: 600,
    sameSite: "lax"
  });
  store.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    maxAge: 600,
    sameSite: "lax"
  });

  console.log("OAuth state and verifier cookies set", { isProduction });

  return new Response(null, { status: 302, headers: { Location: url.toString() } });
}
