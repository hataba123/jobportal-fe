"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
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

  const handleSwitch = (targetLocale: "vi" | "en") => {
    if (locale === targetLocale) return;

    // Set cookie NEXT_LOCALE so middleware and Next.js remember the preference
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000;SameSite=Lax`;

    // Compute path without locale prefix
    let cleanPath = pathname || "/";
    if (typeof window !== "undefined") {
      cleanPath = window.location.pathname.replace(/^\/(en|vi)(?=\/|$)/, "") || "/";
    }

    const search = typeof window !== "undefined" ? window.location.search : "";
    const targetUrl = `/${targetLocale}${cleanPath === "/" ? "" : cleanPath}${search}`;

    // Full page navigation to ensure complete stylesheet and asset loading without Next.js CSS unmounting bugs
    window.location.href = targetUrl;
  };

  const getHref = (targetLocale: "vi" | "en") => {
    const cleanPath = pathname?.replace(/^\/(en|vi)(?=\/|$)/, "") || "/";
    return `/${targetLocale}${cleanPath === "/" ? "" : cleanPath}`;
  };

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
      <a
        href={getHref("vi")}
        onClick={(e) => {
          e.preventDefault();
          handleSwitch("vi");
        }}
        className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
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
      </a>
      <a
        href={getHref("en")}
        onClick={(e) => {
          e.preventDefault();
          handleSwitch("en");
        }}
        className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
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
      </a>
    </div>
  );
}
