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
import { useCategories } from "@/hooks/useCategories";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { categories } = useCategories();

  if (loading) return null; // hoặc return <Loading />

  // Transform categories for HoverDropdown
  const categoryItems = categories.map((category) => ({
    label: category.name,
    href: `/candidate/category/${category.id}`,
  }));

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
              mainHref="/candidate/job"
              items={categoryItems}
            />
            {/* Dropdown */}
            {/* <HoverDropdown
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
            /> */}
            {/* Dropdown */}
            <Link
              href={"/candidate/company"}
              className="text-white hover:underline"
            >
              All Companies
            </Link>
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

        <div className="relative flex md:hidden w-full h-16 mx-auto px-1.5 py-3 items-center justify-between">
          {/* Nút menu bên trái */}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
          {/* Logo ở giữa tuyệt đối */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src="/image/Image.jpg"
              alt="Logo"
              width={85}
              height={32}
              style={{ height: "32px", width: "85px", objectFit: "contain" }}
            />
          </Link>
          {/* Sign in/Sign up bên phải */}
          <Link
            href="/candidate/auth/login"
            className="text-white hover:underline ml-auto "
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-white absolute top-16 left-0 w-3/5 bg-black">
          <div>
            <p className="font-medium">Danh mục việc làm</p>
            {categoryItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block ml-4 hover:text-blue-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="font-medium">Liên kết</p>
            <Link
              href="/candidate/company"
              className="block ml-4 hover:text-blue-200"
            >
              Công ty
            </Link>
            <Link
              href="/candidate/blog"
              className="block ml-4 hover:text-blue-200"
            >
              Blog
            </Link>
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
