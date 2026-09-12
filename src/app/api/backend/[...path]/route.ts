import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const getBackendUrl = () => {
  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    throw new Error("BACKEND_API_URL chưa được cấu hình");
  }
  return baseUrl.replace(/\/$/, "");
};

const MAX_REQUEST_BYTES = 10 * 1024 * 1024;
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function limitBody(
  body: ReadableStream<Uint8Array>,
  maxBytes: number,
  onLimit: () => void,
): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  let bytesRead = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const chunk = await reader.read();
      if (chunk.done) {
        controller.close();
        return;
      }
      bytesRead += chunk.value.byteLength;
      if (bytesRead > maxBytes) {
        onLimit();
        await reader.cancel("request body too large");
        controller.error(new Error("request body too large"));
        return;
      }
      controller.enqueue(chunk.value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const configuredOrigin = process.env.APP_ORIGIN ?? process.env.NEXTAUTH_URL;
  const allowedOrigins = [request.nextUrl.origin, configuredOrigin]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.replace(/\/$/, ""));
  return allowedOrigins.includes(origin.replace(/\/$/, ""));
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  if (MUTATING_METHODS.has(request.method) && !hasTrustedOrigin(request)) {
    return NextResponse.json({ message: "Nguồn gửi request không hợp lệ." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ message: "Nội dung request vượt quá 10MB." }, { status: 413 });
  }

  const { path } = await context.params;
  const targetUrl = `${getBackendUrl()}/${path.map(encodeURIComponent).join("/")}${
    request.nextUrl.search
  }`;
  const token = (await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })) as { jwt?: string } | null;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const ifMatch = request.headers.get("if-match");
  const ifNoneMatch = request.headers.get("if-none-match");
  const ifModifiedSince = request.headers.get("if-modified-since");
  const range = request.headers.get("range");
  const correlationId = request.headers.get("x-correlation-id");
  const clientIp = request.headers.get("x-real-ip");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (ifMatch) headers.set("if-match", ifMatch);
  if (ifNoneMatch) headers.set("if-none-match", ifNoneMatch);
  if (ifModifiedSince) headers.set("if-modified-since", ifModifiedSince);
  if (range) headers.set("range", range);
  if (correlationId) headers.set("x-correlation-id", correlationId);
  // Chỉ chuyển tiếp địa chỉ do reverse proxy đặt vào X-Real-IP; không lấy
  // X-Forwarded-For do client tự gửi để tránh giả mạo hạn mức.
  if (clientIp) headers.set("x-forwarded-for", clientIp);
  if (token?.jwt) headers.set("authorization", `Bearer ${token.jwt}`);

  let response: Response;
  let requestBodyTooLarge = false;
  try {
    const requestInit: RequestInit & { duplex?: "half" } = {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) || !request.body
        ? undefined
        : limitBody(request.body, MAX_REQUEST_BYTES, () => { requestBodyTooLarge = true; }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    };
    // Node fetch yêu cầu duplex khi chuyển tiếp request body dạng stream.
    if (requestInit.body) requestInit.duplex = "half";
    response = await fetch(targetUrl, requestInit);
  } catch (error) {
    if (requestBodyTooLarge)
      return NextResponse.json({ message: "Nội dung request vượt quá 10MB." }, { status: 413 });
    const status = error instanceof DOMException && error.name === "TimeoutError" ? 504 : 502;
    return NextResponse.json({ message: "Không thể kết nối đến dịch vụ API." }, { status });
  }

  const responseHeaders = new Headers();
  for (const header of [
    "content-type",
    "content-disposition",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
    "retry-after",
    "x-correlation-id",
  ]) {
    const value = response.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }
  responseHeaders.set("cache-control", "no-store, private");
  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
