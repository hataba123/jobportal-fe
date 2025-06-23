import HomepageContent from "@/components/common/HomepageContent";
import { setRequestLocale } from "next-intl/server";
// import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // const t = await getTranslations("NavBar");
  return (
    <main>
      <HomepageContent />
    </main>
  );
}
