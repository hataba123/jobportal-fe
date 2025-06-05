import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing"; // hoặc từ 'src/routing' tùy vị trí file

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|vi)/:path*"],
};
