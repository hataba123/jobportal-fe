"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  FileText,
  Bookmark,
  Bell,
  Settings,
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

type Props = {
  user: {
    fullName: string;
    role: "ADMIN" | "RECRUITER" | "CANDIDATE";
  };
  onLogout: () => void;
};

export default function UserDropdown({ user, onLogout }: Props) {
  const router = useRouter();
  const t = useTranslations("UserDropdown");

  const handleLogout = () => {
    onLogout?.();
    router.push("/candidate/auth/login");
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "ADMIN":
        return { label: t("role_admin"), color: "bg-purple-100 text-purple-700 border-purple-200" };
      case "RECRUITER":
        return { label: t("role_recruiter"), color: "bg-amber-100 text-amber-800 border-amber-200" };
      default:
        return { label: t("role_candidate"), color: "bg-blue-100 text-blue-700 border-blue-200" };
    }
  };

  const roleInfo = getRoleBadge();
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-white/40 select-none">
            {initials}
          </div>
          <div className="hidden lg:flex flex-col text-left mr-0.5">
            <span className="text-sm font-semibold text-slate-800 leading-tight max-w-[120px] truncate">
              {user.fullName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {roleInfo.label}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 p-1.5 shadow-xl border border-slate-200/80 rounded-2xl bg-white animate-in fade-in-50 zoom-in-95 z-50"
      >
        <DropdownMenuLabel className="p-2.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</p>
            <div className="pt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-slate-100" />

        <DropdownMenuGroup>
          {user.role === "CANDIDATE" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/candidate/userprofiles/profile")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>{t("profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/candidate/userprofiles/applications")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>{t("applications")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/candidate/userprofiles/saved-jobs")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>{t("saved_jobs")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/candidate/userprofiles/matches")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t("matches")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/candidate/userprofiles/notifications")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-400" />
                <span>{t("notifications")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/candidate/userprofiles/settings")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>{t("settings")}</span>
              </DropdownMenuItem>
            </>
          )}

          {user.role === "RECRUITER" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/recruiter/dashboard")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>{t("recruiter_dashboard")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/recruiter/jobs")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{t("manage_jobs")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/recruiter/applications")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>{t("manage_applications")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/recruiter/candidates")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>{t("talent_pool")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/recruiter/company")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{t("company_profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/recruiter/settings")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>{t("recruiter_settings")}</span>
              </DropdownMenuItem>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>{t("admin_dashboard")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/job-post")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{t("manage_jobs")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/user")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>{t("manage_users")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/company")}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{t("manage_companies")}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-slate-100" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors font-medium"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
