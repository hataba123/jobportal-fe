import { redirect } from "@/i18n/navigation";

export default async function RootPage({
  params,
}: {
  params: { locale: string };
}) {
  // Phải await params nếu dùng trong async function
  const { locale } = await params;

  redirect({
    href: "/candidate",
    locale,
  });
  return null;
}
