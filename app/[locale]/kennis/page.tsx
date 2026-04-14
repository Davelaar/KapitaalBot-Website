import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
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
    title: t(locale, "kennis.hub.metaTitle"),
    description: t(locale, "kennis.hub.metaDesc"),
    path: "/kennis",
  });
}

export default async function KennisHubPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          {t(locale, "kennis.hub.h1")}
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", lineHeight: 1.65 }}>
          {t(locale, "kennis.hub.intro")}
        </p>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", lineHeight: 1.65, marginTop: "0.75rem" }}>
          {t(locale, "kennis.hub.focus")}
        </p>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", lineHeight: 1.65, marginTop: "0.75rem" }}>
          {t(locale, "kennis.hub.seoNote")}
        </p>
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
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                {t(locale, `seo.hub.card.${slug}.desc`)}
              </p>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
            {t(locale, "nav.dashboard")} →
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/spec")} className="kb-text-link">
            SPEC
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/docs")} className="kb-text-link">
            {t(locale, "nav.docs")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/faq")} className="kb-text-link">
            FAQ
          </Link>
        </p>
      </article>
    </main>
  );
}
