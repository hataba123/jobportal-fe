import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function HomePage() {
  const t = useTranslations("NavBar");
  const locale = useLocale();
  return (
    <div>
      <h1>{t("admin")}</h1>
      <h1>Welcome! Locale: {locale}</h1>;<Link href="/jobs">{t("admin")}</Link>
    </div>
  );
}
