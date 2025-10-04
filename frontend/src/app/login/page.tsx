import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginContent from "./LoginContent";

export default async function LoginPage() {
  const { user } = await getCurrentSession();
  if (user) return redirect("/");

  return <LoginContent />;
}
