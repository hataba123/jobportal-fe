import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>; // <-- Là Promise
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale); // phải gọi trước useTranslations

  const t = await getTranslations("NavBar");
  // Load translations for the "NavBar" namespace
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col items-center justify-center">
      <h1>{t("admin")}</h1>
      <h1>Welcome! Locale: {locale}</h1>
      <Link href="/job">{t("admin")}</Link>
    </div>
  );
}
// Note: The `Link` component should be defined in your i18n/navigation module
// and should handle locale changes appropriately.
