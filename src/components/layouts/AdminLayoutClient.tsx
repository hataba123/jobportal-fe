// src/components/layouts/AdminLayoutClient.tsx
"use client";

import { useState } from "react";
import { useAuth, mapRoleEnumToString } from "@/contexts/AuthContext";
import UserDropdown from "@/components/common/UserDropdown";
import { Link } from "@/i18n/navigation";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white p-6 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <h1 className="text-3xl font-bold mb-8">JobPortal Admin</h1>

        <nav className="flex flex-col space-y-3">
          <Link
            href="/admin/dashboard"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/user"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Users
          </Link>
          <Link
            href="/admin/company"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Company
          </Link>
          <Link
            href="/admin/job-post"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Job Posts
          </Link>
          <Link
            href="/admin/review"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Reviews
          </Link>
          <Link
            href="/admin/notification"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Notifications
          </Link>
        </nav>

        <div className="mt-auto text-sm text-blue-300">© 2025 JobPortal</div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-gradient-to-r from-white to-blue-600 shadow px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-gray-900"
              aria-label="Notifications"
            >
              🔔
            </button>
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
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
