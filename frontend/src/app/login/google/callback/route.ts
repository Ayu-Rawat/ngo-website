import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { getUserFromGoogleId, createUserWithGoogle } from "@/lib/db-utils";
import { lucia } from "@/lib/session";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const store = await cookies();
  const storedState = store.get("google_oauth_state")?.value ?? null;
  const verifier = store.get("google_code_verifier")?.value ?? null;

  // Debug logging
  console.log("OAuth Callback Debug:", {
    hasCode: !!code,
    hasState: !!state,
    hasStoredState: !!storedState,
    hasVerifier: !!verifier,
    stateMatch: state === storedState,
    allCookies: store.getAll().map(c => c.name)
  });

  if (!code || !state || !storedState || !verifier || state !== storedState) {
    const error = !code ? "missing code" 
      : !state ? "missing state" 
      : !storedState ? "missing stored state (cookie not found)" 
      : !verifier ? "missing verifier (cookie not found)"
      : "state mismatch";
    console.error("OAuth validation failed:", error);
    return new Response(`Invalid or missing parameters: ${error}`, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, verifier);
    const accessToken = tokens.accessToken();

    const userResp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const googleUser = await userResp.json();

    const existing = await getUserFromGoogleId(googleUser.id);
    const user = existing
      ? existing
      : await createUserWithGoogle(googleUser.id, googleUser.name, googleUser.email || "", "user");

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    store.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(null, { status: 302, headers: { Location: "/" } });
  } catch (e) {
    console.error("Google auth error:", e);
    return new Response("Authentication failed", { status: 400 });
  }
}
