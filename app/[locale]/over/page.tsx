import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: t(locale, "about.metaTitle"),
    description: t(locale, "about.metaDesc"),
    path: "/over",
    keywords: t(locale, "about.metaKeywords"),
  });
}

export default async function OverPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const pStyle = { color: "var(--muted)", lineHeight: 1.65 as const, fontSize: "0.9375rem", marginBottom: "1rem" };
  const h2Style = { fontSize: "1.2rem", marginTop: "1.75rem", marginBottom: "0.75rem", fontWeight: 600 as const };
  const ctaBtn = {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--card-bg)",
    color: "var(--fg)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 600,
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.25rem 2.5rem" }}>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← {t(locale, "nav.system")}
        </Link>
      </nav>

      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}>{t(locale, "about.h1")}</h1>
        <p style={{ ...pStyle, fontSize: "1rem", color: "var(--fg)" }}>{t(locale, "about.intro")}</p>

        <h2 style={h2Style}>{t(locale, "about.section.origin.title")}</h2>
        <p style={pStyle}>{t(locale, "about.section.origin.p1")}</p>
        <p style={pStyle}>{t(locale, "about.section.origin.p2")}</p>
        <p style={pStyle}>{t(locale, "about.section.origin.p3")}</p>

        <h2 style={h2Style}>{t(locale, "about.section.ecosystem.title")}</h2>
        <p style={pStyle}>{t(locale, "about.section.ecosystem.p1")}</p>
        <ul style={{ ...pStyle, paddingLeft: "1.25rem", marginTop: 0 }}>
          <li style={{ marginBottom: "0.65rem" }}>{t(locale, "about.section.ecosystem.bullet1")}</li>
          <li>{t(locale, "about.section.ecosystem.bullet2")}</li>
        </ul>

        <h2 style={h2Style}>{t(locale, "about.section.support.title")}</h2>
        <p style={pStyle}>{t(locale, "about.section.support.p1")}</p>
        <p style={pStyle}>{t(locale, "about.section.support.p2")}</p>

        <p style={{ ...pStyle, marginTop: "1.5rem", fontStyle: "italic" }}>{t(locale, "about.closing")}</p>

        <div
          className="card"
          style={{
            marginTop: "2rem",
            padding: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <span style={{ width: "100%", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
            {t(locale, "about.cta.contact")} · {t(locale, "about.cta.tier2")}
          </span>
          <Link href={withLocale(locale, "/contact")} style={ctaBtn}>
            {t(locale, "about.cta.contact")}
          </Link>
          <Link href={withLocale(locale, "/tier2-request")} style={{ ...ctaBtn, borderColor: "var(--accent)", color: "var(--accent)" }}>
            {t(locale, "about.cta.tier2")}
          </Link>
          <Link href={withLocale(locale, "/kennis")} style={ctaBtn}>
            {t(locale, "about.cta.kennis")}
          </Link>
          <Link href={withLocale(locale, "/faq")} style={ctaBtn}>
            {t(locale, "about.cta.faq")}
          </Link>
        </div>
      </article>
    </main>
  );
}
