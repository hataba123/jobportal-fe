"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Link
        href={pathname}
        locale="en"
        className={`${
          locale === "en" ? "text-white font-bold" : "text-gray-400"
        }`}
      >
        EN
      </Link>
      <span className="text-white">|</span>
      <Link
        href={pathname}
        locale="vi"
        className={`${
          locale === "vi" ? "text-white font-bold" : "text-gray-400"
        }`}
      >
        VI
      </Link>
    </div>
  );
}
