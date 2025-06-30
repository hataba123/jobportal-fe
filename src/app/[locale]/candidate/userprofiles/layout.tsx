// app/page.tsx
// // tắt Static Generation (SSG) - HTML tạo trước, khi next build
// export const dynamic = "force-dynamic";

import CandidateHeader from "@/components/candidate/CandidateHeader";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      <main className="flex-grow">
        <CandidateHeader />
        {children}
      </main>
    </>
  );
}
