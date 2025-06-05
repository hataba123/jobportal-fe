// Header dùng cho mỗi page: hiển thị tiêu đề, breadcrumb, hoặc nút action
"use client";
// src/components/common/Header.tsx
import React from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode; // Có thể truyền nút Add, Filter, v.v.
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, rightElement }) => {
  return (
    <div className="flex justify-between items-center py-6 border-b border-gray-200 mb-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {/* Nút hoặc search bar bên phải (nếu có) */}
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

export default Header;
