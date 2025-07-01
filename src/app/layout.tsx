import "./globals.css";
// app/page.tsx
// // tắt Static Generation (SSG) - HTML tạo trước, khi next build
// export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // <-- Là Promise
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }
  return (
    <html lang={locale}>
      <body clasosName="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
