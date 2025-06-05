"use client";

import Dropdown from "./Dropdown"; // nếu cùng thư mục
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow border-e-indigo-800">
      <Link href="/" className="text-xl font-bold">
        MyApp
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/about" className="hover:text-blue-500">
          About
        </Link>

        <Dropdown
          label="Services"
          items={[
            { label: "Web Development", href: "/services/web" },
            { label: "Admin", href: "/admin/page" },
            { label: "Consulting", href: "/services/consulting" },
            { label: "Công việc", href: "/jobs/page" },
          ]}
        />

        <Link href="/contact" className="hover:text-blue-500">
          Contact
        </Link>
      </div>
    </nav>
  );
}
