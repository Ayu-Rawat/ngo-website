"use server";

import { getCurrentSession, invalidateSession, lucia } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
  }
  const blank = lucia.createBlankSessionCookie();
  const store = await cookies();
  store.set(blank.name, blank.value, blank.attributes);
  redirect("/login");
}
