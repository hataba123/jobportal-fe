"use client";

import type React from "react";

import { usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecruiterHeaderNav } from "@/components/recruiter-header-nav"; // Import new header nav

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    switch (path) {
      case "/recruiter":
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
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {" "}
            {/* Added flex for logo and nav */}
            <div className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-900">
                IT Job Recruiter
              </span>
            </div>
            <RecruiterHeaderNav /> {/* Place header navigation here */}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Recruiter"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-right">
                <p className="text-sm font-medium">TechCorp Vietnam</p>
                <p className="text-xs text-gray-500">Recruiter</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Page Content */}
      <main className="flex-1 p-6 overflow-auto">
        {" "}
        {/* Removed ml-64 */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {getTitle(pathname)}
        </h1>{" "}
        {/* Title moved here */}
        {children}
      </main>
    </div>
  );
}
