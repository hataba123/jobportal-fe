"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth, mapRoleEnumToString } from "@/contexts/AuthContext";
import UserDropdown from "@/components/common/UserDropdown";
import NotificationBell from "@/components/common/NotificationBell";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  CreditCard,
  Star,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Settings,
  FolderTree,
  Newspaper,
} from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "ADMIN")) {
      router.replace("/candidate/auth/login");
    }
  }, [isAuthenticated, loading, role, router]);

  if (loading || !isAuthenticated || role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải Admin Portal...</p>
        </div>
      </div>
    );
  }

  const navSections = [
    {
      title: "Tổng quan & Giám sát",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Hoạt động tuyển dụng",
      items: [
        { href: "/admin/job-post", label: "Tin tuyển dụng", icon: Briefcase },
        { href: "/admin/job-application", label: "Đơn ứng tuyển", icon: FileText },
        { href: "/admin/plans", label: "Gói tín dụng sàn", icon: CreditCard },
      ],
    },
    {
      title: "Người dùng & Doanh nghiệp",
      items: [
        { href: "/admin/user", label: "Tài khoản người dùng", icon: Users },
        { href: "/admin/company", label: "Doanh nghiệp", icon: Building2 },
        { href: "/admin/review", label: "Kiểm duyệt đánh giá", icon: Star },
      ],
    },
    {
      title: "Nội dung & Danh mục",
      items: [
        { href: "/admin/category", label: "Ngành nghề & Danh mục", icon: FolderTree },
        { href: "/admin/blog", label: "Bài viết & Cẩm nang", icon: Newspaper },
      ],
    },
    {
      title: "Cấu hình hệ thống",
      items: [
        { href: "/admin/notification", label: "Thông báo hệ thống", icon: Bell },
        { href: "/admin/settings", label: "Cài đặt & Bảo mật", icon: Settings },
      ],
    },
  ];

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/admin/dashboard":
        return { title: "Tổng quan hệ thống", subtitle: "Thống kê lưu lượng, tài khoản và hoạt động tuyển dụng toàn sàn" };
      case "/admin/job-post":
        return { title: "Quản lý bài đăng tuyển dụng", subtitle: "Kiểm duyệt, chỉnh sửa hoặc gỡ bỏ tin tuyển dụng" };
      case "/admin/job-application":
        return { title: "Quản lý đơn ứng tuyển", subtitle: "Giám sát tất cả đơn nộp hồ sơ giữa ứng viên và nhà tuyển dụng" };
      case "/admin/plans":
        return { title: "Quản lý gói dịch vụ", subtitle: "Cấu hình hạn mức tín dụng và phí dịch vụ sàn" };
      case "/admin/user":
        return { title: "Quản lý tài khoản", subtitle: "Danh sách ứng viên, nhà tuyển dụng và phân quyền quản trị" };
      case "/admin/company":
        return { title: "Quản lý doanh nghiệp", subtitle: "Kiểm duyệt thông tin công ty và hồ sơ pháp lý" };
      case "/admin/review":
        return { title: "Kiểm duyệt đánh giá", subtitle: "Xem xét bình luận, chấm điểm sao và xử lý báo cáo vi phạm" };
      case "/admin/category":
        return { title: "Quản lý ngành nghề & danh mục", subtitle: "Chuẩn hóa các nhóm ngành nghề và lĩnh vực hoạt động" };
      case "/admin/blog":
        return { title: "Quản lý bài viết & cẩm nang", subtitle: "Biên tập, xuất bản bài viết và cẩm nang định hướng nghề nghiệp" };
      case "/admin/notification":
        return { title: "Thông báo hệ thống", subtitle: "Phát thông báo tới toàn thể người dùng hoặc cá nhân" };
      case "/admin/settings":
        return { title: "Cài đặt hệ thống", subtitle: "Bảo mật tài khoản quản trị và cấu hình sàn" };
      default:
        return { title: "Admin Portal", subtitle: "Trung tâm quản trị toàn diện JobPortal" };
    }
  };

  const meta = getPageTitle(pathname);

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
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <BrandLogo href="/admin/dashboard" size="sm" variant="dark" />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-5 py-3 border-b border-slate-900/70 bg-purple-950/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Super Admin Control
          </span>
        </div>

        {/* Nav Sections */}
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
                          ? "bg-purple-600 text-white shadow-xs font-bold"
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

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-900">
          <Link
            href="/candidate"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span>Xem sàn ứng viên</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quản trị viên</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-purple-600 font-bold truncate">{meta.title}</span>
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

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {meta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {meta.subtitle}
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
