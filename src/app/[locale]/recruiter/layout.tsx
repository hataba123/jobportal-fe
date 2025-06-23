"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import UserDropdown from "@/components/common/UserDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { mapRoleEnumToString } from "@/contexts/AuthContext"; // nếu bạn đã export hàm map

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false); // Trạng thái bật/tắt menu mobile
  const { user, logout, loading } = useAuth();
  if (loading) return null; // hoặc return <Loading />

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ">
      {/* === Navbar / Header === */}
      <header className="bg-blue-300 shadow px-6 py-4 flex items-center justify-between text-white">
        {/* Logo hoặc tên hệ thống */}
        <h1 className="text-xl font-bold mx-auto">Recruiter Panel</h1>

        {/* ==== Menu điều hướng cho màn hình lớn (md trở lên) ==== */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/recruiter/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/recruiter/jobs" className="hover:text-blue-600">
            Jobs
          </Link>
          <Link href="/recruiter/create-job" className="hover:text-blue-600">
            Create Job
          </Link>
          <Link href="/recruiter/candidates" className="hover:text-blue-600">
            Candidates
          </Link>
          <div className="flex items-center space-x-4 mr-5.5 ml-auto">
            {user && (
              <UserDropdown
                user={{
                  fullName: user.fullName,
                  role: mapRoleEnumToString(user.role),
                }}
                onLogout={logout}
              />
            )}
          </div>
        </nav>

        {/* ==== Nút ☰ chỉ hiện trên mobile (md:hidden) ==== */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      {/* ==== Menu cho mobile: chỉ hiện khi menuOpen true ==== */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow px-6 py-4 space-y-2">
          <Link
            href="/recruiter/dashboard"
            className="block hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Link href="/recruiter/jobs" className="block hover:text-blue-600">
            Jobs
          </Link>
          <Link
            href="/recruiter/create-job"
            className="block hover:text-blue-600"
          >
            Create Job
          </Link>
          <Link
            href="/recruiter/candidates"
            className="block hover:text-blue-600"
          >
            Candidates
          </Link>
        </nav>
      )}

      {/* === Nội dung chính === */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
