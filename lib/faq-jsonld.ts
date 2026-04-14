import { FAQ_SECTIONS } from "@/lib/faq-sections";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { withLocale } from "@/lib/locale-path";
import { getSiteUrl } from "@/lib/site";

const inLanguage: Record<Locale, string> = {
  nl: "nl-NL",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
};

function normalizeAnswerText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Schema.org JSON-LD: FAQPage + BreadcrumbList for rich results / crawl hints.
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function buildFaqStructuredData(locale: Locale): Record<string, unknown> {
  const base = getSiteUrl();
  const faqUrl = `${base}${withLocale(locale, "/faq")}`;
  const homeUrl = `${base}${withLocale(locale, "/")}`;

  const mainEntity = FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: t(locale, item.qKey),
      acceptedAnswer: {
        "@type": "Answer",
        text: normalizeAnswerText(t(locale, item.aKey)),
      },
    }))
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${faqUrl}#faqpage`,
        url: faqUrl,
        inLanguage: inLanguage[locale],
        mainEntity,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${faqUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t(locale, "nav.home"),
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t(locale, "faq.title"),
            item: faqUrl,
          },
        ],
      },
    ],
  };
}
