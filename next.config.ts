import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error -- allowedDevOrigins chưa có trong type nhưng có thật
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://192.168.1.6:3000", // thay bằng đúng IP bạn dùng
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
