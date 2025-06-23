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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // 👈 Ref để kiểm soát timeout

  const handleLogout = () => {
    onLogout?.();

    switch (user.role) {
      case "RECRUITER":
        router.push("/candidate/auth/login");
        break;
      case "CANDIDATE":
      case "ADMIN":
      default:
        router.push("/candidate/dashboard");
        break;
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 50); // 👈 chờ 200ms rồi mới tắt dropdown
  };

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
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-black">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
