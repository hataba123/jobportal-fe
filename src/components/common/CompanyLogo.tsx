"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toBackendUrl } from "@/lib/api/url";

interface CompanyLogoProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  rounded?: "rounded" | "rounded-lg" | "rounded-xl" | "rounded-2xl" | "rounded-full";
}

const GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-violet-600 to-purple-600",
  "from-emerald-600 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-600 to-blue-600",
];

function getGradient(name: string = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name: string = "") {
  const clean = name.trim();
  if (!clean) return "JP";
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function CompanyLogo({
  src,
  name = "Company",
  size = "md",
  className = "",
  rounded = "rounded-xl",
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  const dimMap: Record<string, { size: number; text: string }> = {
    sm: { size: 36, text: "text-xs font-bold" },
    md: { size: 48, text: "text-sm font-bold" },
    lg: { size: 64, text: "text-lg font-bold" },
    xl: { size: 80, text: "text-xl font-extrabold" },
  };

  const dim = typeof size === "number" ? { size, text: "text-sm font-bold" } : dimMap[size] || dimMap.md;
  const gradient = getGradient(name);
  const initials = getInitials(name);

  // Normalize image URL
  let imageUrl: string | null = null;
  if (src && src !== "/placeholder.svg" && !src.includes("placeholder.svg")) {
    imageUrl = toBackendUrl(src);
  }

  if (!imageUrl || hasError) {
    return (
      <div
        style={{ width: `${dim.size}px`, height: `${dim.size}px` }}
        className={`flex-shrink-0 flex items-center justify-center bg-gradient-to-tr ${gradient} text-white shadow-xs border border-white/20 select-none ${rounded} ${dim.text} ${className}`}
        title={name}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: `${dim.size}px`, height: `${dim.size}px` }}
      className={`relative flex-shrink-0 bg-white border border-slate-200/80 overflow-hidden shadow-xs flex items-center justify-center p-1 ${rounded} ${className}`}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={dim.size}
        height={dim.size}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
