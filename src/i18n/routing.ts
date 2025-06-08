import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "vi"],
  defaultLocale: "en",
  localePrefix: "always", // chỉ dùng prefix khi không phải defaultLocale
  // Used when no locale matches
});
