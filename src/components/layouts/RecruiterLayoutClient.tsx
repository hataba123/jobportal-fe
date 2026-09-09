"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth, mapRoleEnumToString } from "@/contexts/AuthContext";
import UserDropdown from "@/components/common/UserDropdown";
import NotificationBell from "@/components/common/NotificationBell";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Sparkles,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  PlusCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "RECRUITER")) {
      router.replace("/candidate/auth/login");
    }
  }, [isAuthenticated, loading, role, router]);

  if (loading || !isAuthenticated || role !== "RECRUITER") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải Recruiter Portal...</p>
        </div>
      </div>
    );
  }

  const navSections = [
    {
      title: "Tuyển dụng & Hồ sơ",
      items: [
        { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/recruiter/jobs", label: "Việc làm của tôi", icon: Briefcase },
        { href: "/recruiter/applications", label: "Đơn ứng tuyển", icon: FileText },
        { href: "/recruiter/matches", label: "Xếp hạng ứng viên AI", icon: Sparkles },
        { href: "/recruiter/candidates", label: "Tìm ứng viên (Talent Pool)", icon: Users },
      ],
    },
    {
      title: "Doanh nghiệp & Dịch vụ",
      items: [
        { href: "/recruiter/company", label: "Hồ sơ công ty", icon: Building2 },
        { href: "/recruiter/plans", label: "Gói tín dụng & VIP", icon: CreditCard },
        { href: "/recruiter/analytics", label: "Báo cáo hiệu suất", icon: BarChart3 },
        { href: "/recruiter/settings", label: "Cài đặt tài khoản", icon: Settings },
      ],
    },
  ];

  const getPageMeta = (path: string) => {
    switch (path) {
      case "/recruiter/dashboard":
        return { title: "Tổng quan tuyển dụng", subtitle: "Thống kê tin đăng và tình hình ứng tuyển hôm nay" };
      case "/recruiter/jobs":
        return { title: "Quản lý việc làm", subtitle: "Đăng tin mới, cập nhật nội dung và theo dõi trạng thái" };
      case "/recruiter/applications":
        return { title: "Danh sách đơn ứng tuyển", subtitle: "Xem xét, duyệt hoặc từ chối hồ sơ ứng viên" };
      case "/recruiter/matches":
        return { title: "Xếp hạng ứng viên AI", subtitle: "Phân tích mức độ tương thích kỹ năng với tin đăng" };
      case "/recruiter/plans":
        return { title: "Gói tín dụng & Đăng tin", subtitle: "Nâng cấp gói dịch vụ để tiếp cận nhiều ứng viên hơn" };
      case "/recruiter/candidates":
        return { title: "Tìm kiếm nhân tài", subtitle: "Tra cứu cơ sở dữ liệu ứng viên tiềm năng trong toàn sàn" };
      case "/recruiter/company":
        return { title: "Hồ sơ doanh nghiệp", subtitle: "Tùy chỉnh thông tin thương hiệu, logo và quy mô công ty" };
      case "/recruiter/analytics":
        return { title: "Báo cáo tuyển dụng", subtitle: "Số liệu chi tiết về tương tác và lượt nộp hồ sơ" };
      case "/recruiter/settings":
        return { title: "Cài đặt tài khoản", subtitle: "Quản lý thông báo và thông tin người phụ trách" };
      default:
        return { title: "Recruiter Portal", subtitle: "Nền tảng quản lý tuyển dụng thông minh" };
    }
  };

  const currentMeta = getPageMeta(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar (Slate Dark) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
          <BrandLogo href="/recruiter/dashboard" size="sm" variant="dark" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Job Quick CTA */}
        <div className="p-4 border-b border-slate-900/80">
          <Link
            href="/recruiter/jobs"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng tin tuyển dụng</span>
          </Link>
        </div>

        {/* Nav Links List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs font-bold"
                          : "text-slate-300 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Bottom / Link to Candidate Portal */}
        <div className="p-3 border-t border-slate-900">
          <Link
            href="/candidate"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span>Trang chủ Ứng viên</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Nhà tuyển dụng</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 font-bold truncate">{currentMeta.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="h-5 w-px bg-slate-200" />
            {user && (
              <UserDropdown
                user={{
                  fullName: user.fullName,
                  role: mapRoleEnumToString(user.role) as "ADMIN" | "RECRUITER" | "CANDIDATE",
                }}
                onLogout={logout}
              />
            )}
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Header Banner */}
          <div className="mb-6">
            {/* FIXED: Title is now dark and clearly legible (NOT white on gray)! */}
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentMeta.subtitle}
            </p>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
