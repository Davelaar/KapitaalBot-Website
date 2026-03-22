import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { parseLocaleParam } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
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
