// app/page.tsx
// // tắt Static Generation (SSG) - HTML tạo trước, khi next build
// export const dynamic = "force-dynamic";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // <-- Là Promise
}) {
  // Ensure that the incoming `locale` is valid
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
