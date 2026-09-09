"use client";

import { useEffect } from "react";
import type React from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { RecruiterHeaderNav } from "@/components/recruiter-header-nav"; // Import new header nav
import { useAuth } from "@/contexts/AuthContext";
import { mapRoleEnumToString } from "@/contexts/AuthContext";
import UserDropdown from "@/components/common/UserDropdown";
import { Link } from "@/i18n/navigation";
import NotificationBell from "@/components/common/NotificationBell";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "RECRUITER")) {
      router.replace("/candidate/auth/login");
    }
  }, [isAuthenticated, loading, role, router]);

  if (loading) return null; // hoặc return <Loading />

  if (!isAuthenticated || role !== "RECRUITER") return null;

  const getTitle = (path: string) => {
    switch (path) {
      case "/recruiter/dashboard":
        return "Dashboard";
      case "/recruiter/jobs":
        return "Việc làm của tôi";
      case "/recruiter/applications":
        return "Đơn ứng tuyển";
      case "/recruiter/candidates":
        return "Tìm ứng viên";
      case "/recruiter/company":
        return "Hồ sơ công ty";
      case "/recruiter/analytics":
        return "Báo cáo";
      case "/recruiter/settings":
        return "Cài đặt";
      case "/recruiter/notifications":
        return "Thông báo";
      default:
        return "Recruiter Dashboard";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {" "}
      {/* Changed to flex-col */}
      {/* Top Header */}
      <header className="bg-black text-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {" "}
            {/* Added flex for logo and nav */}
            <div className="flex items-center space-x-2">
              <Image
                src="/image/Image.jpg?height=32&width=32"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white">
                <Link href="/recruiter/dashboard">IT Job Recruiter</Link>
              </span>
            </div>
            <RecruiterHeaderNav /> {/* Place header navigation here */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Auth Section */}
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <UserDropdown
                  user={{
                    fullName: user!.fullName,
                    role: mapRoleEnumToString(user!.role), // 🔁 ánh xạ enum → string
                  }}
                  onLogout={logout}
                />
              </>
            ) : (
              <Link
                href="/candidate/auth/login"
                className="text-white hover:text-white hover:underline"
              >
                Sign in / Sign up
              </Link>
            )}
          </div>
        </div>
      </header>
      {/* Page Content */}
      <main className="flex-1 p-6 overflow-auto">
        {" "}
        {/* Removed ml-64 */}
        <h1 className="text-2xl font-semibold text-white mb-6">
          {getTitle(pathname)}
        </h1>{" "}
        {/* Title moved here */}
        {children}
      </main>
    </div>
  );
}
