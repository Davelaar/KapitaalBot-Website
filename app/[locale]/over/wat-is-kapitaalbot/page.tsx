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
    title: t(locale, "watkap.metaTitle"),
    description: t(locale, "watkap.metaDesc"),
    path: "/over/wat-is-kapitaalbot",
    keywords: t(locale, "watkap.metaKeywords"),
  });
}

/** Rendert `**vet**` in vertaalstrings als <strong>. */
function InlineBold({ text }: { text: string }) {
  const parts = text.split(/\*\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default async function WatIsKapitaalbotPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const pStyle = {
    color: "var(--muted)",
    lineHeight: 1.65 as const,
    fontSize: "0.9375rem",
    marginBottom: "1rem",
  };
  const h2Style = {
    fontSize: "1.2rem",
    marginTop: "1.75rem",
    marginBottom: "0.75rem",
    fontWeight: 600 as const,
  };
  const h3Style = { fontSize: "1.05rem", marginTop: "1.25rem", marginBottom: "0.5rem", fontWeight: 600 as const };
  const listStyle = { ...pStyle, paddingLeft: "1.25rem", marginTop: 0 };

  const welKeys = ["watkap.wel.b1", "watkap.wel.b2", "watkap.wel.b3", "watkap.wel.b4", "watkap.wel.b5"] as const;
  const nietKeys = ["watkap.niet.b1", "watkap.niet.b2", "watkap.niet.b3", "watkap.niet.b4"] as const;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.25rem 2.5rem" }}>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/over")} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← {t(locale, "nav.over.story")}
        </Link>
      </nav>

      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}>
          {t(locale, "watkap.h1")}
        </h1>
        <p style={{ ...pStyle, fontSize: "1rem", color: "var(--fg)" }}>{t(locale, "watkap.intro")}</p>

        <h2 style={h2Style}>{t(locale, "watkap.wel.title")}</h2>
        <ul style={listStyle}>
          {welKeys.map((key) => (
            <li key={key} style={{ marginBottom: "0.65rem" }}>
              <InlineBold text={t(locale, key)} />
            </li>
          ))}
        </ul>

        <h2 style={h2Style}>{t(locale, "watkap.niet.title")}</h2>
        <ul style={listStyle}>
          {nietKeys.map((key) => (
            <li key={key} style={{ marginBottom: "0.65rem" }}>
              <InlineBold text={t(locale, key)} />
            </li>
          ))}
        </ul>

        <h3 style={h3Style}>{t(locale, "watkap.waarom.title")}</h3>
        <p style={pStyle}>{t(locale, "watkap.waarom.p1")}</p>

        <p style={{ ...pStyle, marginTop: "1.5rem", fontStyle: "italic", color: "var(--fg)" }}>{t(locale, "watkap.closing")}</p>
      </article>
    </main>
  );
}
