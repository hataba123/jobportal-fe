"use client";

import { useState } from "react";
import { mapRoleEnumToString } from "@/contexts/AuthContext"; // nếu bạn đã export hàm map
import UserDropdown from "@/components/common/UserDropdown";
import { useAuth } from "@/contexts/AuthContext";
// app/page.tsx
// // tắt Static Generation (SSG) - HTML tạo trước, khi next build
// export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { user, logout, loading } = useAuth();
  if (loading) return null; // hoặc return <Loading />

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white p-6 transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <h1 className="text-3xl font-bold mb-8">JobPortal Admin</h1>

        <nav className="flex flex-col space-y-3">
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Job Listings
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Candidates
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Employers
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Applications
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Categories
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-blue-800">
            Settings
          </a>
        </nav>

        <div className="mt-auto text-sm text-blue-300">© 2025 JobPortal</div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-gradient-to-r from-white to-blue-600 shadow px-6">
          {/* Mobile sidebar toggle button */}
          <button
            id="sidebarToggle"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {/* Hamburger icon */}
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

          {/* Page title */}
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

          {/* Notification & Profile icons */}
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-gray-900"
              aria-label="Notifications"
            >
              🔔
            </button>
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
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
