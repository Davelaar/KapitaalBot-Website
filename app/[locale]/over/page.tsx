import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { t, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: t(locale, "over.meta.title"),
    description: t(locale, "over.meta.desc"),
    path: "/over",
    keywords: t(locale, "over.meta.keywords"),
  });
}

export default async function OverPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const pStyle = { color: "var(--muted)", lineHeight: 1.65 as const, fontSize: "0.9375rem", marginBottom: "1rem" };
  const h2Style = { fontSize: "1.2rem", marginTop: "1.75rem", marginBottom: "0.75rem", fontWeight: 600 as const };
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link" style={{ fontSize: "0.9rem" }}>
          ← {t(locale, "over.nav.back")}
        </Link>
      </nav>

      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}>
          {t(locale, "over.h1")}
        </h1>
        <p style={{ ...pStyle, fontSize: "1rem", color: "var(--fg)" }}>
          {t(locale, "over.intro")}
        </p>

        <h2 style={h2Style}>{t(locale, "over.h2.why")}</h2>
        <p style={pStyle}>{t(locale, "over.why.body")}</p>

        <h2 style={h2Style}>{t(locale, "over.h2.scope")}</h2>
        <p style={pStyle}>{t(locale, "over.scope.body")}</p>
        <ul style={{ ...pStyle, paddingLeft: "1.25rem", marginTop: 0 }}>
          <li style={{ marginBottom: "0.65rem" }}>{t(locale, "over.scope.li1")}</li>
          <li>{t(locale, "over.scope.li2")}</li>
        </ul>

        <h2 style={h2Style}>{t(locale, "over.h2.hierarchy")}</h2>
        <p style={pStyle}>{t(locale, "over.hierarchy.p1")}</p>
        <p style={pStyle}>{t(locale, "over.hierarchy.p2")}</p>

        <p style={{ ...pStyle, marginTop: "1.5rem", fontStyle: "italic" }}>
          {t(locale, "over.summary")}
        </p>

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
            {t(locale, "over.canonical.label")}
          </span>
          <Link href={withLocale(locale, "/over/wat-is-kapitaalbot")} className="kb-cta-row-btn kb-cta-row-btn--primary">
            {t(locale, "over.canonical.wat")}
          </Link>
          <Link href={withLocale(locale, "/over/bitvavo-vs-kraken")} className="kb-cta-row-btn">
            {t(locale, "nav.over.bitvavoKraken")}
          </Link>
          <Link href={withLocale(locale, "/over/fundme")} className="kb-cta-row-btn">
            {t(locale, "nav.over.fundme")}
          </Link>
          <Link href={withLocale(locale, "/spec")} className="kb-cta-row-btn">
            SPEC
          </Link>
          <Link href={withLocale(locale, "/dashboard")} className="kb-cta-row-btn">
            {t(locale, "over.canonical.dashboard")}
          </Link>
          <Link href={withLocale(locale, "/docs")} className="kb-cta-row-btn">
            {t(locale, "over.canonical.docs")}
          </Link>
          <Link href={withLocale(locale, "/faq")} className="kb-cta-row-btn">
            FAQ
          </Link>
        </div>
      </article>
    </main>
  );
}
