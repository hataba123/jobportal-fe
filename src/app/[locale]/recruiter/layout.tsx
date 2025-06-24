// src/app/[locale]/admin/layout.tsx  ✅ vẫn là Server Component
import RecruiterLayoutClient from "@/components/layouts/RecruiterLayoutClient";
export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecruiterLayoutClient>{children}</RecruiterLayoutClient>;
}
