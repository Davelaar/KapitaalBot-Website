import Link from "next/link";
import { Tier2RequestForm } from "@/components/Tier2RequestForm";
import { t, type Locale } from "@/lib/i18n";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: `${t(locale, "access.title")} — KapitaalBot`,
    description: t(locale, "access.intro"),
    path: "/tier2-request",
  });
}

export default async function Tier2RequestPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.system")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        {t(locale, "access.title")}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.75rem", maxWidth: "50ch" }}>
        {t(locale, "access.intro")}
      </p>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.8125rem", maxWidth: "50ch" }}>
        {t(locale, "access.tier2.disclaimer")}
      </p>
      <Tier2RequestForm />
    </main>
  );
}
