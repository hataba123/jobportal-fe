"use client";

import React from "react";
import { Link } from "@/i18n/navigation";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  iconOnly?: boolean;
  className?: string;
}

export default function BrandLogo({
  href = "/",
  size = "md",
  variant = "light",
  iconOnly = false,
  className = "",
}: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      icon: "w-7 h-7 text-sm",
      text: "text-lg",
      badge: "text-[10px] px-1.5 py-0.5",
    },
    md: {
      icon: "w-9 h-9 text-base",
      text: "text-xl",
      badge: "text-[11px] px-2 py-0.5",
    },
    lg: {
      icon: "w-11 h-11 text-lg",
      text: "text-2xl",
      badge: "text-xs px-2.5 py-1",
    },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Dynamic Modern Logo Icon */}
      <div
        className={`${sizeClasses.icon} relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-200`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <rect width="20" height="14" x="2" y="6" rx="2" />
          <circle cx="12" cy="13" r="1.5" fill="currentColor" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white"></span>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight transition-colors ${
                variant === "dark" ? "text-white" : "text-slate-900"
              } ${sizeClasses.text}`}
            >
              Job<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Portal</span>
            </span>
            <span
              className={`font-bold uppercase tracking-wider rounded-md ${
                variant === "dark"
                  ? "bg-slate-800 text-blue-400 border border-slate-700"
                  : "bg-blue-50 text-blue-600 border border-blue-100"
              } ${sizeClasses.badge}`}
            >
              IT
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
