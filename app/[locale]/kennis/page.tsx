import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { KENNIS_SLUGS } from "@/lib/kennis-slugs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: t(locale, "seo.hub.metaTitle"),
    description: t(locale, "seo.hub.metaDesc"),
    path: "/kennis",
  });
}

export default async function KennisHubPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "seo.hub.h1")}</h1>
        <p style={{ color: "var(--muted)", maxWidth: "65ch", lineHeight: 1.6 }}>{t(locale, "seo.hub.intro")}</p>
        <p style={{ color: "var(--muted)", maxWidth: "65ch", lineHeight: 1.6, marginTop: "1rem" }}>{t(locale, "seo.hub.p1")}</p>
        <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
          {KENNIS_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={withLocale(locale, `/kennis/${slug}`)}
              className="card"
              style={{ display: "block", padding: "1rem 1.25rem", textDecoration: "none", color: "inherit" }}
            >
              <h2 style={{ fontSize: "1.1rem", marginBottom: "0.35rem", color: "var(--fg)" }}>
                {t(locale, `seo.hub.card.${slug}.title`)}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>{t(locale, `seo.hub.card.${slug}.desc`)}</p>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "nav.data")} →
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/docs")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "nav.architecture")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/faq")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "nav.research")}
          </Link>
        </p>
      </article>
    </main>
  );
}
