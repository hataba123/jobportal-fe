import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.6:3000",
  ],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
