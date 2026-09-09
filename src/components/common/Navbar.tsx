"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import BrandLogo from "@/components/common/BrandLogo";
import HoverDropdown from "@/components/common/HoverDropdown";
import UserDropdown from "@/components/common/UserDropdown";
import NotificationBell from "@/components/common/NotificationBell";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { mapRoleEnumToString, useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import {
  Menu,
  X,
  Briefcase,
  Building2,
  BookOpen,
  Sparkles,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { categories } = useCategories();
  const pathname = usePathname();

  if (loading) return null;

  const categoryItems = categories.map((cat) => ({
    label: cat.name,
    href: `/candidate/category/${cat.id}`,
  }));

  const roleString = user ? mapRoleEnumToString(user.role) : null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <BrandLogo href="/" size="md" />

            <nav className="hidden md:flex items-center space-x-1">
              <HoverDropdown
                label="Việc làm"
                mainHref="/candidate/job"
                items={categoryItems}
              />

              <Link
                href="/candidate/company"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname?.startsWith("/candidate/company")
                    ? "text-blue-600 bg-blue-50/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                Công ty
              </Link>

              <Link
                href="/candidate/blog"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname?.startsWith("/candidate/blog")
                    ? "text-blue-600 bg-blue-50/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Right: Actions, Language, Auth */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher variant="light" />

            {/* Recruiter / Employer Quick Action */}
            {roleString === "RECRUITER" ? (
              <Link
                href="/recruiter/jobs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Đăng tin tuyển dụng</span>
              </Link>
            ) : roleString === "ADMIN" ? (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200"
              >
                <span>Admin Panel</span>
              </Link>
            ) : (
              <Link
                href="/candidate/auth/register"
                className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                <span>Nhà tuyển dụng?</span>
                <span className="underline">Đăng tin ngay</span>
              </Link>
            )}

            <div className="h-5 w-px bg-slate-200" />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <UserDropdown
                  user={{
                    fullName: user.fullName,
                    role: roleString as "ADMIN" | "RECRUITER" | "CANDIDATE",
                  }}
                  onLogout={logout}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/candidate/auth/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/candidate/auth/register"
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95"
                >
                  <span>Đăng ký</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Khám phá
            </p>
            <Link
              href="/candidate/job"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Tất cả việc làm</span>
            </Link>
            <Link
              href="/candidate/company"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Công ty hàng đầu</span>
            </Link>
            <Link
              href="/candidate/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Blog & Tin tức</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-slate-500">Ngôn ngữ</span>
              <LanguageSwitcher variant="light" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-xl">
                  <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <UserDropdown
                  user={{
                    fullName: user.fullName,
                    role: roleString as "ADMIN" | "RECRUITER" | "CANDIDATE",
                  }}
                  onLogout={logout}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/candidate/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/candidate/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
