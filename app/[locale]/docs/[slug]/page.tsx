import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, t, type Locale } from "@/lib/i18n";
import DocViewer from "@/components/DocViewer";
import { buildPageMetadata } from "@/lib/page-metadata";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");
const CANONICAL_DOCS = new Set([
  "ENGINE_SSOT",
  "ARCHITECTURE_ENGINE_CURRENT",
  "OBSERVABILITY_SNAPSHOT_CONTRACT",
  "CHANGELOG_ENGINE",
  "LIVE_RUNBOOK_CURRENT",
  "VALIDATION_MODEL_CURRENT",
  "DOC_INDEX",
]);

const DOC_META: Record<string, { labelKey: string }> = {
  ENGINE_SSOT: { labelKey: "docs.meta.ENGINE_SSOT.label" },
  DOC_INDEX: { labelKey: "docs.meta.DOC_INDEX.label" },
};

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function getCanonicalDocSlugs(): string[] {
  return getDocSlugs().filter((slug) => CANONICAL_DOCS.has(slug));
}

export function generateStaticParams() {
  const slugs = getCanonicalDocSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { slug, locale: lp } = params;
  const locale = parseLocaleParam(lp);
  const label = slug && DOC_META[slug]?.labelKey ? t(locale, DOC_META[slug].labelKey) : slug;
  const docsTitle = t(locale, "docs.title");
  return buildPageMetadata({
    locale,
    title: `${label} — ${docsTitle}`,
    description: `${docsTitle}: ${label}. KapitaalBot-engine.`,
    path: `/docs/${slug}`,
  });
}

export default async function DocSlugPage({ params }: { params: { locale: string; slug: string } }) {
  const { slug, locale: lp } = params;
  const locale = parseLocaleParam(lp) as Locale;
  const isNl = locale === "nl";
  const slugs = getCanonicalDocSlugs();
  if (!slugs.includes(slug)) notFound();

  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/docs")} className="kb-text-link">
          ← {t(locale, "docs.title")}
        </Link>
      </nav>
      <section className="docs-two-col" style={{ display: "grid", gap: "1rem", alignItems: "start" }}>
        <aside className="card" style={{ position: "sticky", top: "1rem", marginBottom: 0 }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>
            {isNl ? "Canonieke docs" : "Canonical docs"}
          </h2>
          <ul
            className="docs-file-list"
            style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {slugs.map((s) => (
              <li key={s}>
                <Link
                  href={withLocale(locale, `/docs/${s}`)}
                  className={`docs-file-link${s === slug ? " docs-file-link--active" : ""}`}
                >
                  {s}.md
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <article className="card" style={{ padding: "1rem 1.25rem", marginBottom: 0 }}>
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            {isNl
              ? "Publieke docs zijn functioneel volledig en canoniek, maar bevatten geen broncode, geen private accountdetails en geen reproduceerbare tuning."
              : "Public docs are functionally complete and canonical, but contain no source code, no private account details, and no reproducible tuning."}
          </p>
          <DocViewer content={content} />
        </article>
      </section>
    </main>
  );
}
