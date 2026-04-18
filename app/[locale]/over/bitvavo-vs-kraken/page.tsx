import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site";
import { t, type Locale } from "@/lib/i18n";
import { bitvavoKrakenMeta } from "@/lib/bitvavo-kraken-article/meta";
import { BitvavoKrakenArticleBody } from "@/components/BitvavoKrakenArticleBody";

export const dynamic = "force-dynamic";

const PATH = "/over/bitvavo-vs-kraken";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  const m = bitvavoKrakenMeta[locale];
  return buildPageMetadata({
    locale,
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    path: PATH,
    openGraphType: "article",
  });
}

function jsonLdArticle(locale: Locale) {
  const m = bitvavoKrakenMeta[locale];
  const base = getSiteUrl().replace(/\/+$/, "");
  const url = `${base}${withLocale(locale, PATH)}`;
  const inLang =
    locale === "nl" ? "nl-NL" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : "en-US";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: m.title,
    description: m.description,
    inLanguage: inLang,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: {
      "@type": "Person",
      name: "Raymond Davelaar",
    },
    publisher: {
      "@type": "Organization",
      name: "KapitaalBot",
      url: base,
    },
    about: [
      { "@type": "Thing", name: "Bitvavo" },
      { "@type": "Thing", name: "Kraken exchange" },
      { "@type": "Thing", name: "MiCA" },
      { "@type": "Thing", name: "Cryptocurrency regulation Netherlands" },
    ],
    isAccessibleForFree: true,
  };
}

export default async function BitvavoVsKrakenPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const ld = jsonLdArticle(locale);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <nav style={{ marginBottom: "1.5rem" }} aria-label="Breadcrumb">
        <Link href={withLocale(locale, "/over")} className="kb-text-link" style={{ fontSize: "0.9rem" }}>
          ← {t(locale, "bk.nav.back")}
        </Link>
      </nav>

      <article itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={bitvavoKrakenMeta[locale].title} />
        <meta itemProp="description" content={bitvavoKrakenMeta[locale].description} />
        <BitvavoKrakenArticleBody locale={locale} />

        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "2rem", lineHeight: 1.6 }}>
          <strong>{t(locale, "bk.footer.sources")}:</strong> {t(locale, "bk.footer.disclaimerBody")}
        </p>

        <div
          className="card"
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <Link href={withLocale(locale, "/faq")} className="kb-cta-row-btn kb-cta-row-btn--primary">
            FAQ
          </Link>
          <Link href={withLocale(locale, "/kennis")} className="kb-cta-row-btn">
            {t(locale, "breadcrumb.kennis")}
          </Link>
          <Link href={withLocale(locale, "/dashboard")} className="kb-cta-row-btn">
            {t(locale, "nav.data")}
          </Link>
        </div>
      </article>
    </main>
  );
}
