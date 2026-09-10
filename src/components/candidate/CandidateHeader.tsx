"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  User,
  FileText,
  Bookmark,
  Bell,
  Sparkles,
  Settings,
} from "lucide-react";

const navigationItems = [
  {
    name: "Hồ sơ cá nhân",
    href: "/candidate/userprofiles/profile",
    icon: User,
  },
  {
    name: "Việc làm đã ứng tuyển",
    href: "/candidate/userprofiles/applications",
    icon: FileText,
  },
  {
    name: "Việc làm đã lưu",
    href: "/candidate/userprofiles/saved-jobs",
    icon: Bookmark,
  },
  {
    name: "Gợi ý việc làm thông minh",
    href: "/candidate/userprofiles/matches",
    icon: Sparkles,
  },
  {
    name: "Thông báo",
    href: "/candidate/userprofiles/notifications",
    icon: Bell,
  },
  {
    name: "Cài đặt tài khoản",
    href: "/candidate/userprofiles/settings",
    icon: Settings,
  },
];

export default function CandidateHeader() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-16 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-2xs border border-blue-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
