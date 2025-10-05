import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { NeonAdapter } from "./neon-adapter";

const adapter = new NeonAdapter();

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attr) => ({
    id: attr.id,
    google_id: attr.google_id,
    name: attr.name,
    email: attr.email,
    role: attr.role
  })
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: {};
    DatabaseUserAttributes: {
      id: string;
      google_id: string;
      name: string;
      email: string;
      role: "user";
    };
  }
}

export async function deleteSessionTokenCookie() {
  const store = await cookies();
  const blank = lucia.createBlankSessionCookie();
  store.set(blank.name, blank.value, blank.attributes);
}

export async function invalidateSession(sessionId: string) {
  await lucia.invalidateSession(sessionId);
}

// Updated function that doesn't modify cookies in read operations
export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { session: null, user: null };
  }

  try {
    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
      return { session: null, user: null };
    }

    // Don't modify cookies for fresh sessions here either
    return { session, user };
  } catch {
    // Don't modify cookies in catch block
    return { session: null, user: null };
  }
});

// New Server Action for handling session refresh
export async function refreshSession(sessionId: string) {
  const cookieStore = await cookies();
  
  try {
    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
      const blank = lucia.createBlankSessionCookie();
      cookieStore.set(blank.name, blank.value, blank.attributes);
      return { session: null, user: null };
    }

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    return { session, user };
  } catch {
    const blank = lucia.createBlankSessionCookie();
    cookieStore.set(blank.name, blank.value, blank.attributes);
    return { session: null, user: null };
  }
}

// Server Action for clearing invalid sessions
export async function clearInvalidSession() {
  const cookieStore = await cookies();
  const blank = lucia.createBlankSessionCookie();
  cookieStore.set(blank.name, blank.value, blank.attributes);
}
