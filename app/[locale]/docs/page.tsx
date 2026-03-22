import Link from "next/link";
import fs from "fs";
import path from "path";
import { t, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

const DOC_META: Record<string, { labelKey: string; descKey: string }> = {
  ENGINE_SSOT: { labelKey: "docs.meta.ENGINE_SSOT.label", descKey: "docs.meta.ENGINE_SSOT.desc" },
  DOC_INDEX: { labelKey: "docs.meta.DOC_INDEX.label", descKey: "docs.meta.DOC_INDEX.desc" },
  ARCHITECTURE_ENGINE_CURRENT: {
    labelKey: "docs.meta.ARCHITECTURE_ENGINE_CURRENT.label",
    descKey: "docs.meta.ARCHITECTURE_ENGINE_CURRENT.desc",
  },
  LIVE_RUNBOOK_CURRENT: { labelKey: "docs.meta.LIVE_RUNBOOK_CURRENT.label", descKey: "docs.meta.LIVE_RUNBOOK_CURRENT.desc" },
  VALIDATION_MODEL_CURRENT: {
    labelKey: "docs.meta.VALIDATION_MODEL_CURRENT.label",
    descKey: "docs.meta.VALIDATION_MODEL_CURRENT.desc",
  },
  OBSERVABILITY_SNAPSHOT_CONTRACT: {
    labelKey: "docs.meta.OBSERVABILITY_SNAPSHOT_CONTRACT.label",
    descKey: "docs.meta.OBSERVABILITY_SNAPSHOT_CONTRACT.desc",
  },
  CHANGELOG_ENGINE: { labelKey: "docs.meta.CHANGELOG_ENGINE.label", descKey: "docs.meta.CHANGELOG_ENGINE.desc" },
  LOGGING: { labelKey: "docs.meta.LOGGING.label", descKey: "docs.meta.LOGGING.desc" },
  DB_ARCHITECTURE_STALE_EDGE_SAFE: {
    labelKey: "docs.meta.DB_ARCHITECTURE_STALE_EDGE_SAFE.label",
    descKey: "docs.meta.DB_ARCHITECTURE_STALE_EDGE_SAFE.desc",
  },
  VALIDATION_REPORT_REFRESH_15MIN_RESET: {
    labelKey: "docs.meta.VALIDATION_REPORT_REFRESH_15MIN_RESET.label",
    descKey: "docs.meta.VALIDATION_REPORT_REFRESH_15MIN_RESET.desc",
  },
  SYSTEMD_README: { labelKey: "docs.meta.SYSTEMD_README.label", descKey: "docs.meta.SYSTEMD_README.desc" },
};

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

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
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "docs.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {t(locale, "docs.intro")} {t(locale, "docs.page.introExtra")}
      </p>
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
              const meta = DOC_META[slug] ?? { labelKey: slug, descKey: "" };
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
                      className="docs-index-link"
                      style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}
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
