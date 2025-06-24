"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Renders the navigation bar for the recruiter interface.
 * The navigation includes links to various sections such as Dashboard, Jobs,
 * Applications, Candidates, Company Profile, Analytics, Settings, and Notifications.
 * The active link is highlighted based on the current pathname.
 */

/*******  4f1e607a-6aac-46aa-b574-7d78b72c4956  *******/
export function RecruiterHeaderNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/recruiter", label: "Dashboard" },
    { href: "/recruiter/jobs", label: "Việc làm của tôi" },
    { href: "/recruiter/applications", label: "Đơn ứng tuyển" },
    { href: "/recruiter/candidates", label: "Tìm ứng viên" },
    { href: "/recruiter/company", label: "Hồ sơ công ty" },
    { href: "/recruiter/analytics", label: "Báo cáo" },
    { href: "/recruiter/settings", label: "Cài đặt" },
    { href: "/recruiter/notifications", label: "Thông báo" },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
