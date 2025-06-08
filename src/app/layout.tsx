import "./globals.css";
// app/page.tsx
// // tắt Static Generation (SSG) - HTML tạo trước, khi next build
// export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
