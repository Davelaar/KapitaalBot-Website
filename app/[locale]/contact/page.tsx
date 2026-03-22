import { ContactPageContent } from "@/components/ContactPageContent";
import { parseLocaleParam } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: `${t(locale, "contact.title")} — KapitaalBot`,
    description: t(locale, "contact.metaDescription"),
    path: "/contact",
  });
}

export default function ContactPage() {
  return <ContactPageContent />;
}
