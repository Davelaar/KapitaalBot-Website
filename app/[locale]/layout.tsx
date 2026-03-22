import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComplianceBanner from "@/components/ComplianceBanner";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { getKapitaalbotGaMeasurementId } from "@/lib/analytics";
import { t, type Locale, locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";
import { parseLocaleParam } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const lang = parseLocaleParam(params.locale);
  const sectionLabel = t(lang, "nav.system");
  const title = `KapitaalBot — ${sectionLabel}`;
  const description = t(lang, "hero.subline");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "KapitaalBot",
      url: getSiteUrl(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as Locale)) {
    notFound();
  }
  const lang = parseLocaleParam(params.locale);
  const gaId = getKapitaalbotGaMeasurementId();

  return (
    <>
      {gaId ? <link rel="stylesheet" href="/analytics/kapitaalbot-analytics.css" /> : null}
      <div data-kapitaalbot-site-root>
        <NavBar />
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {children}
          <Footer />
          <ComplianceBanner locale={lang} />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${getSiteUrl()}/#website`,
                  name: "KapitaalBot",
                  url: getSiteUrl(),
                  inLanguage: ["nl", "en", "de", "fr"],
                  description: t(lang, "seo.home.metaDesc"),
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${getSiteUrl()}/#software`,
                  name: "KapitaalBot",
                  applicationCategory: "FinanceApplication",
                  operatingSystem: "Linux",
                  description: t(lang, "seo.home.metaDesc"),
                  url: getSiteUrl(),
                },
              ],
            }),
          }}
        />
      </div>
      <Analytics locale={lang} />
    </>
  );
}
