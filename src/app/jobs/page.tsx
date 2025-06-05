import JobList from "@/components/job/JobList";
import { useTranslations } from "next-intl";
export default function JobsPage() {
  const t = useTranslations("NavBar");
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t("recruiters")}</h1>
      <JobList />
    </main>
  );
}
