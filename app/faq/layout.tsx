import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getLocaleFromCookies } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const title = `${t(locale, "faq.title")} — KapitaalBot`;
  const description = t(locale, "faq.intro");
  return buildPageMetadata({
    locale,
    title,
    description,
    path: "/faq",
  });
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
