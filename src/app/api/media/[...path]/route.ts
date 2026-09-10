import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ path: string[] }> };

function getBackendOrigin() {
  const configured = process.env.BACKEND_API_URL?.trim();
  if (!configured) throw new Error("BACKEND_API_URL chưa được cấu hình");

  const withoutTrailingSlash = configured.replace(/\/+$/, "");
  // BACKEND_API_URL hiện được cấu hình dạng http://host:port/api.
  return withoutTrailingSlash.replace(/\/api$/i, "");
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (!path.length || path.some((segment) => segment === ".." || segment === ".")) {
    return NextResponse.json({ message: "Đường dẫn ảnh không hợp lệ" }, { status: 400 });
  }

  const target = `${getBackendOrigin()}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const headers = new Headers();
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);
  if (token && typeof token.jwt === "string") headers.set("authorization", `Bearer ${token.jwt}`);

  const response = await fetch(target, { headers, cache: "no-store" });
  const responseHeaders = new Headers();
  for (const name of ["content-type", "cache-control", "etag", "last-modified"]) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });
}
