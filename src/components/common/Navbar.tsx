"use client";
import Image from "next/image";
import HoverDropdown from "@/components/common/HoverDropdown";
import UserDropdown from "@/components/common/UserDropdown";
import { mapRoleEnumToString } from "@/contexts/AuthContext"; // nếu bạn đã export hàm map

import { Link } from "@/i18n/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher"; // Import
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  if (loading) return null; // hoặc return <Loading />
  console.log("✅ [Navbar] user:", user);
  console.log(user?.fullName);
  console.log("✅ [Navbar] isAuthenticated:", isAuthenticated);
  return (
    <nav className="bg-gradient-to-r from-black to-red-800  border-white ">
      <div className="w-full h-16 mx-auto px-4 py-3 flex justify-between items-center">
        <div className="hidden md:flex items-center justify-between w-full text-white">
          {/* Left: Navigation links */}
          <div className="flex items-center space-x-6">
            <Link href="/">
              <Image
                src="/image/Image.jpg" // ✅ Đường dẫn đúng nếu ảnh nằm trong public/image/
                alt="Logo"
                width={85}
                height={32}
                style={{ height: "32px", width: "85px", objectFit: "contain" }} // or cover
              />
            </Link>
            {/* Dropdown */}
            <HoverDropdown
              label="All Jobs"
              mainHref="/candidate/dashboard"
              items={[
                {
                  label: "Công nghệ thông tin",
                  href: "/jobs/category/cong-nghe-thong-tin",
                },
                { label: "Thiết kế", href: "/jobs/category/thiet-ke" },
                { label: "Marketing", href: "/jobs/category/marketing" },
                { label: "Tài chính", href: "/jobs/category/tai-chinh" },
                { label: "Nhân sự", href: "/jobs/category/nhan-su" },
                { label: "Bán hàng", href: "/jobs/category/ban-hang" },
                { label: "Bảo mật", href: "/jobs/category/bao-mat" },
                {
                  label: "Hỗ trợ khách hàng",
                  href: "/jobs/category/ho-tro-khach-hang",
                },
              ]}
            />
            {/* Dropdown */}
            <HoverDropdown
              label="All Companies"
              mainHref="/candidate/company"
              items={[
                {
                  label: "Công ty lớn (500+ nhân viên)",
                  href: "/company?size=large",
                },
                {
                  label: "Công ty vừa (100-500 nhân viên)",
                  href: "/company?size=medium",
                },
                {
                  label: "Công ty nhỏ (<100 nhân viên)",
                  href: "/company?size=small",
                },
                { label: "Startup nổi bật", href: "/company?type=startup" },
                { label: "Công ty công nghệ", href: "/company?field=it" },
                { label: "Công ty thiết kế", href: "/company?field=design" },
                // Thêm các nhóm khác nếu cần
              ]}
            />
            {/* Dropdown */}
            <Link
              href={"/candidate/blog"}
              className="text-white hover:underline"
            >
              Blogs
            </Link>
          </div>

          {/* Right: Auth + Language */}
          {/* 👉 Language Switcher ở desktop */}
          {/* <div className="flex items-center space-x-4 mr-5.5 ml-auto">
            <Link href="/auth/login">  in/Sign up</Link>
          </div> */}
          <div className="flex items-center space-x-4 mr-5.5 ml-auto">
            {isAuthenticated ? (
              <UserDropdown
                user={{
                  fullName: user!.fullName,
                  role: mapRoleEnumToString(user!.role), // 🔁 ánh xạ enum → string
                }}
                onLogout={logout}
              />
            ) : (
              <Link
                href="/candidate/auth/login"
                className="text-white hover:underline"
              >
                Sign in / Sign up
              </Link>
            )}
          </div>

          <LanguageSwitcher />
        </div>
        {/* Mobile Button - an tu kich thuoc 768px */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-white absolute top-16 left-0 w-3/5 bg-black">
          <div>
            <p className="font-medium">Services</p>
            <Link
              href="/services/web"
              className="block ml-4 hover:text-blue-200"
            >
              Web Dev
            </Link>
            <Link
              href="/services/mobile"
              className="block ml-4 hover:text-blue-200"
            >
              Mobile Dev
            </Link>
          </div>
          {/* 👉 Language Switcher ở mobile */}
          <div>
            <Link href="/candidate/auth/login">Sign in / Sign up</Link>
          </div>
          {/* 👉 Language Switcher ở mobile */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
