import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing"; // hoặc từ 'src/routing' tùy vị trí file
// import { NextRequest } from "next/server";

// Nếu dùng Clerk (bạn chỉ bật phần này khi dùng Clerk)
// import {clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server';
// const isProtectedRoute = createRouteMatcher(['/:locale/dashboard(.*)']);

// // Nếu dùng NextAuth
// import {withAuth} from 'next-auth/middleware';

// const publicPages = ['/', '/login']; // Các trang công khai không cần đăng nhập
// const locales = routing.locales; // Lấy danh sách locale từ cấu hình
// // Khởi tạo middleware i18n
// const handleI18nRouting = createMiddleware(routing);

// // Middleware xác thực NextAuth
// const authMiddleware = withAuth(
//   function onSuccess(req) {
//     // Nếu đã xác thực thành công, tiếp tục xử lý i18n
//     return handleI18nRouting(req);
//   },
//   {
//     callbacks: {
//       authorized: ({token}) => token != null // Nếu có token thì cho qua
//     },
//     pages: {
//       signIn: '/login' // Trang đăng nhập tùy chỉnh
//     }
//   }
// );

//  // Nếu là trang công khai → chỉ xử lý i18n
//   if (isPublicPage) {
//     const response = handleI18nRouting(req);
//     return await updateSession(req, response); // Kết hợp với Supabase
//   }

//   // Nếu là trang yêu cầu xác thực → chạy middleware Auth.js
//   const response = (authMiddleware as any)(req) as NextResponse;
//   return await updateSession(req, response); // Kết hợp Supabase luôn
// }

// export function middleware(request: NextRequest) {
//   // Nếu truy cập root, redirect sang /en
//   if (request.nextUrl.pathname === "/") {
//     return Response.redirect(new URL("/en", request.url));
//   }
//   // Xử lý i18n như cũ
//   return createMiddleware(routing)(request);
// }
// Matcher entries are linked with a logical "or", therefore
// if one of them matches, the middleware will be invoked

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|vi)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",

    // However, match all pathnames within `/users`, optionally with a locale prefix
    "/([\\w-]+)?/users/(.+)",
  ],
};
