"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  UserIcon,
  DocumentTextIcon,
  BookmarkIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navigationItems = [
  {
    name: "Hồ sơ cá nhân",
    href: "/candidate/userprofiles/profile",
    icon: UserIcon,
    description: "Quản lý thông tin cá nhân",
  },
  {
    name: "Việc làm đã ứng tuyển",
    href: "/candidate/userprofiles/applications",
    icon: DocumentTextIcon,
    description: "Theo dõi đơn ứng tuyển",
  },
  {
    name: "Việc làm đã lưu",
    href: "/candidate/userprofiles/saved-jobs",
    icon: BookmarkIcon,
    description: "Công việc yêu thích",
  },
  {
    name: "Thông báo",
    href: "/candidate/userprofiles/notifications",
    icon: BellIcon,
    description: "Xem tất cả thông báo",
  },
  {
    name: "Cài đặt tài khoản",
    href: "/candidate/userprofiles/settings",
    icon: Cog6ToothIcon,
    description: "Thay đổi mật khẩu, thông tin",
  },
];

export default function CandidateHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 ">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
