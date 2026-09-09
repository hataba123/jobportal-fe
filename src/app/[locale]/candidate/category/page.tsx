import { redirect } from "@/i18n/navigation";

export default async function CategoryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/candidate/job", locale });
}
