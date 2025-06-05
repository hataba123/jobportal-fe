import { ReactNode, use } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>; // 👈 params là Promise!
};

export default function LocaleLayout(props: Props) {
  const { children } = props;
  const { locale } = use(props.params); // ✅ unwrap Promise // ✅ dùng use để lấy giá trị

  const messages = use(getMessages()); // ✅ unwrap getMessages Promise // ✅ lấy messages từ server

  if (!messages) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <nav>
            <Link href={`/${locale}/jobs`}>Jobs</Link>
            <Link href={`/${locale}/contact`}>Contact</Link>
          </nav>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
