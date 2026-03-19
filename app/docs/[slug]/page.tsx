import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { defaultLocale, t, type Locale } from "@/lib/i18n";
import DocViewer from "@/components/DocViewer";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

const DOC_META: Record<string, { labelKey: string }> = {
  ENGINE_SSOT: { labelKey: "docs.meta.ENGINE_SSOT.label" },
  DOC_INDEX: { labelKey: "docs.meta.DOC_INDEX.label" },
};

function getLocaleFromCookieStore(cookieStore: Awaited<ReturnType<typeof cookies>>): Locale {
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieStore(cookieStore);
  const label = slug && DOC_META[slug]?.labelKey ? t(locale, DOC_META[slug].labelKey) : slug;
  const docsTitle = t(locale, "docs.title");
  return {
    title: `${label} — ${docsTitle}`,
    description: `${docsTitle}: ${label}. KapitaalBot-engine.`,
  };
}

export default async function DocSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieStore(cookieStore);
  const slugs = getDocSlugs();
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
        <Link href="/docs" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "docs.title")}
        </Link>
      </nav>
      <section className="docs-two-col" style={{ display: "grid", gap: "1rem", alignItems: "start" }}>
        <aside className="card" style={{ position: "sticky", top: "1rem", marginBottom: 0 }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>{t(locale, "docs.slug.files")}</h2>
          <ul
            className="docs-file-list"
            style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {slugs.map((s) => (
              <li key={s}>
                <Link
                  href={`/docs/${s}`}
                  className="docs-file-link"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: s === slug ? "var(--accent)" : "var(--fg)",
                    fontSize: "0.86rem",
                    fontWeight: s === slug ? 700 : 500,
                    padding: "0.2rem 0.25rem",
                    borderRadius: 6,
                    background: s === slug ? "rgba(45,212,191,0.12)" : "transparent",
                  }}
                >
                  {s}.md
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <article className="card" style={{ padding: "1rem 1.25rem", marginBottom: 0 }}>
          <DocViewer content={content} />
        </article>
      </section>
    </main>
  );
}
