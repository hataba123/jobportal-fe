import { redirect } from "@/i18n/navigation";

export default function RootPage({ params }: { params: { locale: string } }) {
  redirect({
    href: "/candidate/dashboard",
    locale: params.locale,
  });

  return null;
}
