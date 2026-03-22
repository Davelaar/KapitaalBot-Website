import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { isKennisSlug, KENNIS_SLUGS } from "@/lib/kennis-slugs";
import { seoPageKeys } from "@/lib/seo-i18n";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return KENNIS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (!isKennisSlug(params.slug)) return {};
  const locale = await getLocaleFromCookies();
  const keys = seoPageKeys(params.slug);
  return buildPageMetadata({
    locale,
    title: t(locale, keys.metaTitle),
    description: t(locale, keys.metaDesc),
    path: `/kennis/${params.slug}`,
  });
}

function isMissingKey(translation: string, key: string): boolean {
  return translation === key || translation.trim().length === 0;
}

export default async function KennisArticlePage({ params }: { params: { slug: string } }) {
  if (!isKennisSlug(params.slug)) notFound();
  const locale = await getLocaleFromCookies();
  const keys = seoPageKeys(params.slug);

  const bodyParagraphs = keys.p
    .map((key) => ({ key, text: t(locale, key) }))
    .filter(({ key, text }) => !isMissingKey(text, key));

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", fontSize: "0.875rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
        <span style={{ color: "var(--muted)" }}>/</span>
        <Link href="/kennis" style={{ color: "var(--accent)", textDecoration: "none" }}>
          {t(locale, "nav.kennis")}
        </Link>
      </nav>
      <article className="card" style={{ padding: "1.25rem 1.5rem", maxWidth: "72ch" }}>
        <h1 style={{ fontSize: "1.65rem", marginBottom: "0.75rem", fontWeight: 600 }}>{t(locale, keys.h1)}</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "1rem", marginBottom: "1.25rem" }}>{t(locale, keys.lead)}</p>
        {bodyParagraphs.map(({ key, text }) => (
          <p key={key} style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.9375rem", marginBottom: "1rem" }}>
            {text}
          </p>
        ))}
        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          <Link href="/kennis" style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← {t(locale, "nav.kennis")}
          </Link>
          {" · "}
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "nav.data")}
          </Link>
        </p>
      </article>
    </main>
  );
}
