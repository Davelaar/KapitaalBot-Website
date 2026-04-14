import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { DOCS_META } from "@/lib/docs-catalog";
import { getDocSlugs } from "@/lib/docs-filesystem";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  const title = `${t(locale, "docs.title")} — KapitaalBot`;
  const description = `${t(locale, "docs.intro")} ${t(locale, "docs.page.introExtra")}`;
  return buildPageMetadata({
    locale,
    title,
    description,
    path: "/docs",
  });
}

export default async function DocsPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const slugs = getDocSlugs();

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "docs.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {t(locale, "docs.intro")} {t(locale, "docs.page.introExtra")}
      </p>
      <section className="card" style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "4px solid var(--brand)" }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>{t(locale, "docs.index.boundaryTitle")}</h2>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{t(locale, "docs.index.boundaryBody")}</p>
      </section>
      <section className="card" style={{ padding: "1rem 1.25rem" }}>
        <table className="docs-index-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.4rem 0.25rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: 600,
                }}
              >
                {t(locale, "docs.table.topic")}
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.4rem 0.25rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: 600,
                }}
              >
                {t(locale, "docs.table.doc")}
              </th>
            </tr>
          </thead>
          <tbody>
            {slugs.map((slug) => {
              const meta = DOCS_META[slug] ?? { labelKey: slug, descKey: "" };
              return (
                <tr key={slug}>
                  <td style={{ padding: "0.4rem 0.25rem", verticalAlign: "top" }}>
                    <strong>{typeof meta.labelKey === "string" ? t(locale, meta.labelKey) : slug}</strong>
                    {meta.descKey && (
                      <p style={{ margin: "0.15rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>{t(locale, meta.descKey)}</p>
                    )}
                  </td>
                  <td style={{ padding: "0.4rem 0.25rem", verticalAlign: "top" }}>
                    <Link
                      href={withLocale(locale, `/docs/${slug}`)}
                      className="docs-index-link kb-text-link"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {slug}.md
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
