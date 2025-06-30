"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "@/i18n/navigation";

type Props = {
  user: {
    fullName: string;
    role: "ADMIN" | "RECRUITER" | "CANDIDATE";
  };
  onLogout: () => void;
};

export default function UserDropdown({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    onLogout?.();
    router.push("/candidate/auth/login");
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 50);
  };

  const handleMenuClick = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  // Menu items cho ứng viên
  const candidateMenuItems = [
    {
      label: "Hồ sơ cá nhân",
      path: "/candidate/userprofiles/profile",
      icon: "👤",
    },
    {
      label: "Việc làm đã ứng tuyển",
      path: "/candidate/userprofiles/applications",
      icon: "📝",
    },
    {
      label: "Việc làm đã lưu",
      path: "/candidate/userprofiles/saved-jobs",
      icon: "💾",
    },
    {
      label: "Thông báo",
      path: "/candidate/userprofiles/notifications",
      icon: "🔔",
    },
    {
      label: "Cài đặt tài khoản",
      path: "/candidate/userprofiles/settings",
      icon: "⚙️",
    },
  ];

  // Menu items cho nhà tuyển dụng
  const recruiterMenuItems = [
    { label: "Dashboard", path: "/recruiter/dashboard", icon: "📊" },

    { label: "Quản lý công ty", path: "/recruiter/company", icon: "🏢" },
    { label: "Đăng tin tuyển dụng", path: "/recruiter/jobs", icon: "📋" },
    { label: "Ứng viên", path: "/recruiter/candidates", icon: "👥" },
    { label: "Đơn ứng tuyển", path: "/recruiter/applications", icon: "📄" },
    { label: "Thông báo", path: "/recruiter/notifications", icon: "🔔" },
  ];

  // Menu items cho admin
  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },

    { label: "Quản lý người dùng", path: "/admin/user", icon: "👥" },
    { label: "Quản lý công ty", path: "/admin/company", icon: "🏢" },
    { label: "Quản lý tin tuyển dụng", path: "/admin/job-post", icon: "📋" },
    {
      label: "Quản lý đơn ứng tuyển",
      path: "/admin/job-application",
      icon: "📄",
    },
    { label: "Thông báo", path: "/admin/notification", icon: "🔔" },
  ];

  const getMenuItems = () => {
    switch (user.role) {
      case "CANDIDATE":
        return candidateMenuItems;
      case "RECRUITER":
        return recruiterMenuItems;
      case "ADMIN":
        return adminMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="inline-flex items-center space-x-2 focus:outline-none">
        <Image
          src="/image/avatar.png"
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-white">{user.fullName}</span>
        <ChevronDownIcon className="w-4 h-4 ml-1 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-black">
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.path)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
            >
              <span className="mr-2">🚪</span>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
