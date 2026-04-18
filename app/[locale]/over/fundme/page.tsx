import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site";
import { t, type Locale } from "@/lib/i18n";
import { fundMeStrings } from "@/lib/fundme-i18n";
import { FundMeArticleBody } from "@/components/FundMeArticleBody";

export const dynamic = "force-dynamic";

function fm(locale: Locale) {
  return fundMeStrings[locale];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  const f = fm(locale);
  const base = getSiteUrl().replace(/\/+$/, "");
  const ogImage = `${base}/images/over/wat-is-kapitaalbot-desktop.jpg`;
  const meta = buildPageMetadata({
    locale,
    title: f["fundme.metaTitle"],
    description: f["fundme.metaDesc"],
    keywords: f["fundme.metaKeywords"],
    path: "/over/fundme",
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: ogImage, width: 1024, height: 558, alt: "KapitaalBot" }],
    },
    twitter: {
      ...meta.twitter,
      images: [ogImage],
    },
  };
}

const footerStyle = {
  color: "var(--muted)",
  lineHeight: 1.65 as const,
  fontSize: "0.9rem",
  marginTop: "1.75rem",
};

export default async function FundMePage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/over")} className="kb-text-link" style={{ fontSize: "0.9rem" }}>
          ← {t(locale, "nav.over.story")}
        </Link>
      </nav>

      <article>
        <FundMeArticleBody locale={locale} />

        <p style={footerStyle}>
          <Link href={withLocale(locale, "/faq")} className="kb-text-link">
            {t(locale, "nav.faq")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/contact")} className="kb-text-link">
            {t(locale, "nav.contact")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/over/wat-is-kapitaalbot")} className="kb-text-link">
            {t(locale, "nav.over.truth")}
          </Link>
        </p>
      </article>
    </main>
  );
}
