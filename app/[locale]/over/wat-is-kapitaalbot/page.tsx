import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site";
import { t, type Locale } from "@/lib/i18n";
import { watIsKapitaalbotStrings } from "@/lib/wat-is-kapitaalbot-i18n";
import { WatIsKapitaalbotArticleBody } from "@/components/WatIsKapitaalbotArticleBody";

export const dynamic = "force-dynamic";

function wat(locale: Locale) {
  return watIsKapitaalbotStrings[locale];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  const w = wat(locale);
  const base = getSiteUrl().replace(/\/+$/, "");
  const ogImage = `${base}/images/over/wat-is-kapitaalbot-desktop.jpg`;
  const meta = buildPageMetadata({
    locale,
    title: w["watkap.metaTitle"],
    description: w["watkap.metaDesc"],
    keywords: w["watkap.metaKeywords"],
    path: "/over/wat-is-kapitaalbot",
  });
  const heroAlt = w["watkap.heroAlt"];
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: ogImage, width: 1024, height: 558, alt: heroAlt }],
    },
    twitter: {
      ...meta.twitter,
      images: [ogImage],
    },
  };
}

const footerPStyle = {
  color: "var(--muted)",
  lineHeight: 1.65 as const,
  fontSize: "0.9375rem",
  marginTop: "1.25rem",
  marginBottom: "1rem",
};

export default async function WatIsKapitaalbotPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  const w = wat(locale);

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/over")} className="kb-text-link" style={{ fontSize: "0.9rem" }}>
          ← {t(locale, "nav.over.story")}
        </Link>
      </nav>

      <article>
        <figure className="wat-is-kapitaalbot-hero">
          <picture>
            <source media="(max-width: 767px)" type="image/webp" srcSet="/images/over/wat-is-kapitaalbot-mobile.webp" />
            <source media="(max-width: 767px)" srcSet="/images/over/wat-is-kapitaalbot-mobile.jpg" />
            <source type="image/webp" srcSet="/images/over/wat-is-kapitaalbot-desktop.webp" />
            <img
              src="/images/over/wat-is-kapitaalbot-desktop.jpg"
              alt={w["watkap.heroAlt"]}
              width={1024}
              height={558}
              decoding="async"
            />
          </picture>
        </figure>
        <WatIsKapitaalbotArticleBody locale={locale} />

        <p style={{ ...footerPStyle, fontSize: "0.9rem" }}>
          <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
            {t(locale, "nav.dashboard")}
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
          {" · "}
          <Link href={withLocale(locale, "/kennis")} className="kb-text-link">
            {w["watkap.canonKnowledge"]}
          </Link>
        </p>
      </article>
    </main>
  );
}
