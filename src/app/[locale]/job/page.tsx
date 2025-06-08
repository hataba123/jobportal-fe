import JobList from "@/components/job/JobList";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);
  // phải gọi trước useTranslations
  const t = useTranslations("NavBar");
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t("all jobs")}</h1>
      <JobList />
    </main>
  );
}
