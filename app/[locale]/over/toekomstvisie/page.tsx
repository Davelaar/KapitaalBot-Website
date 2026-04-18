import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site";
import { t, type Locale } from "@/lib/i18n";
import { toekomstvisieMeta } from "@/lib/toekomstvisie-article/meta";
import { ToekomstvisieArticleBody } from "@/components/ToekomstvisieArticleBody";

export const dynamic = "force-dynamic";

const PATH = "/over/toekomstvisie";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  const m = toekomstvisieMeta[locale];
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
  const m = toekomstvisieMeta[locale];
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
      { "@type": "Thing", name: "Personal narrative" },
      { "@type": "Thing", name: "Algorithmic trading" },
      { "@type": "Thing", name: "Social impact" },
    ],
    isAccessibleForFree: true,
  };
}

export default async function ToekomstvisiePage({ params }: { params: { locale: string } }) {
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
        <meta itemProp="headline" content={toekomstvisieMeta[locale].title} />
        <meta itemProp="description" content={toekomstvisieMeta[locale].description} />
        <ToekomstvisieArticleBody locale={locale} />

        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "2rem", lineHeight: 1.6 }}>
          {locale === "nl" &&
            "Persoonlijk verhaal en toekomstvisie — geen financieel, juridisch of beleggingsadvies."}
          {locale === "en" && "Personal story and future vision — not financial, legal, or investment advice."}
          {locale === "de" &&
            "Persönliche Geschichte und Zukunftsvision — keine Finanz-, Rechts- oder Anlageberatung."}
          {locale === "fr" &&
            "Récit personnel et vision — pas de conseil financier, juridique ou d’investissement."}
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
          <Link href={withLocale(locale, "/over/fundme")} className="kb-cta-row-btn kb-cta-row-btn--primary">
            {t(locale, "nav.fundme")}
          </Link>
          <Link href={withLocale(locale, "/over/wat-is-kapitaalbot")} className="kb-cta-row-btn">
            {t(locale, "nav.over.truth")}
          </Link>
          <Link href={withLocale(locale, "/faq")} className="kb-cta-row-btn">
            {t(locale, "nav.faq")}
          </Link>
        </div>
      </article>
    </main>
  );
}
