import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, t, type Locale } from "@/lib/i18n";
import DocViewer from "@/components/DocViewer";
import { buildPageMetadata } from "@/lib/page-metadata";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { DOCS_META } from "@/lib/docs-catalog";
import { sortDocSlugsForNav } from "@/lib/docs-nav-order";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function generateStaticParams() {
  const slugs = getDocSlugs();
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
  const label =
    slug && DOCS_META[slug]?.labelKey ? t(locale, DOCS_META[slug].labelKey) : slug;
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
  const slugs = getDocSlugs();
  if (!slugs.includes(slug)) notFound();

  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  const navSlugs = sortDocSlugsForNav(slugs);
  const navAria = isNl ? "Documentatie — alle paginas" : "Documentation — all pages";

  return (
    <main className="docs-article-page">
      <nav style={{ marginBottom: "0.75rem" }}>
        <Link href={withLocale(locale, "/docs")} className="kb-text-link">
          ← {t(locale, "docs.title")}
        </Link>
      </nav>

      <nav className="docs-inline-nav" aria-label={navAria}>
        {navSlugs.map((s) => {
          const label =
            DOCS_META[s]?.labelKey != null ? t(locale, DOCS_META[s].labelKey) : `${s}.md`;
          const active = s === slug;
          return (
            <Link
              key={s}
              href={withLocale(locale, `/docs/${s}`)}
              className={`docs-inline-nav__link${active ? " docs-inline-nav__link--active" : ""}`}
              title={`${s}.md`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <article className="card docs-article-body" style={{ padding: "1rem 1.25rem", marginBottom: 0 }}>
        <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
          {isNl
            ? "Publieke docs zijn functioneel volledig en canoniek, maar bevatten geen broncode, geen private accountdetails en geen reproduceerbare tuning."
            : "Public docs are functionally complete and canonical, but contain no source code, no private account details, and no reproducible tuning."}
        </p>
        <DocViewer content={content} />
      </article>
    </main>
  );
}
