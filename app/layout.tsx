import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { getKapitaalbotGaMeasurementId } from "@/lib/analytics";
import { defaultLocale, t, type Locale } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const lang = (raw && ["nl", "en", "de", "fr"].includes(raw) ? raw : defaultLocale) as Locale;

  const sectionLabel = t(lang, "nav.system");
  const title = `KapitaalBot — ${sectionLabel}`;
  const description = t(lang, "hero.subline");

  return {
    metadataBase: new URL(getSiteUrl()),
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const lang = (raw && ["nl", "en", "de", "fr"].includes(raw) ? raw : defaultLocale) as Locale;
  const gaId = getKapitaalbotGaMeasurementId();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        {gaId ? (
          <link rel="stylesheet" href="/analytics/kapitaalbot-analytics.css" />
        ) : null}
        <div data-kapitaalbot-site-root>
          <NavBar />
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {children}
            <Footer />
            <ComplianceBanner />
          </div>
          <script
            type="application/ld+json"
            // Important: use an explicit closing tag (no children) to avoid
            // React error #60 in some runtimes.
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
          ></script>
        </div>
        <Analytics locale={lang} />
      </body>
    </html>
  );
}
