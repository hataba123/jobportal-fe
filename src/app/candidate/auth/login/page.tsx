import { redirect } from "@/i18n/navigation";
import { cookies } from "next/headers";

export default async function LoginRedirect() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  redirect({ href: "/candidate/auth/login", locale });
} 