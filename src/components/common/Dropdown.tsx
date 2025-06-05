"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false); // Trạng thái mở/đóng dropdown
  const ref = useRef<HTMLDivElement>(null); // Tham chiếu phần tử gốc

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Nút mở dropdown */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-4 py-2 text-sm hover:text-blue-600"
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Danh sách dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded shadow bg-amber-800">
          {items.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
