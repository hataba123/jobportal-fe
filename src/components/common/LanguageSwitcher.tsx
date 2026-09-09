"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "light",
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  const isLight = variant === "light";

  return (
    <div
      className={`inline-flex items-center gap-1 p-0.5 rounded-full border text-xs font-semibold ${
        isLight
          ? "bg-slate-100/90 border-slate-200/80 text-slate-600"
          : "bg-slate-800/90 border-slate-700 text-slate-300"
      } ${className}`}
      id="language-switcher"
    >
      <div className="pl-1.5 pr-0.5 text-slate-400 flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <Link
        href={pathname}
        locale="vi"
        className={`px-2 py-0.5 rounded-full transition-all duration-150 ${
          locale === "vi"
            ? isLight
              ? "bg-white text-blue-600 font-bold shadow-xs"
              : "bg-blue-600 text-white font-bold shadow-xs"
            : isLight
            ? "hover:text-slate-900 text-slate-500"
            : "hover:text-white text-slate-400"
        }`}
      >
        VI
      </Link>
      <Link
        href={pathname}
        locale="en"
        className={`px-2 py-0.5 rounded-full transition-all duration-150 ${
          locale === "en"
            ? isLight
              ? "bg-white text-blue-600 font-bold shadow-xs"
              : "bg-blue-600 text-white font-bold shadow-xs"
            : isLight
            ? "hover:text-slate-900 text-slate-500"
            : "hover:text-white text-slate-400"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
