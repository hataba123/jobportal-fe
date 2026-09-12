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
  const token = process.env.NEXTAUTH_SECRET
    ? await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    : null;
  const headers = new Headers();
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);
  if (token && typeof token.jwt === "string") headers.set("authorization", `Bearer ${token.jwt}`);

  let response: Response;
  try {
    response = await fetch(target, { headers, cache: "no-store", signal: AbortSignal.timeout(30_000) });
  } catch {
    return NextResponse.json({ message: "Không thể tải ảnh từ dịch vụ API." }, { status: 502 });
  }
  const responseHeaders = new Headers();
  for (const name of ["content-type", "cache-control", "etag", "last-modified"]) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  if (path.some((segment) => segment.toLowerCase().endsWith(".svg"))) {
    responseHeaders.set("content-security-policy", "default-src 'none'; sandbox");
    responseHeaders.set("content-disposition", "attachment");
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
