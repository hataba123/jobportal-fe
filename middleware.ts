import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const getApplicationPath = (pathname: string) =>
  pathname.replace(/^\/(en|vi)(?=\/|$)/, "") || "/";

const requiredRole = (pathname: string) => {
  if (pathname.startsWith("/admin")) return 0;
  if (pathname.startsWith("/recruiter")) return 1;
  if (pathname.startsWith("/candidate/userprofiles")) return 2;
  return null;
};

export async function middleware(request: NextRequest) {
  const applicationPath = getApplicationPath(request.nextUrl.pathname);
  const role = requiredRole(applicationPath);
  if (role === null) return handleI18nRouting(request);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const backendUser = (token as { backendUser?: { role?: number } } | null)
    ?.backendUser;

  if (!token || backendUser?.role !== role) {
    const locale = request.nextUrl.pathname.match(/^\/(en|vi)(?:\/|$)/)?.[1] ?? "en";
    const loginUrl = new URL(
      `/${locale}/candidate/auth/login`,
      request.url
    );
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|vi)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
