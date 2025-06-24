// src/app/[locale]/admin/layout.tsx  ✅ vẫn là Server Component
import AdminLayoutClient from "@/components/layouts/AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
