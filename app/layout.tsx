import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { defaultLocale, t, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const lang = (raw && ["nl", "en", "de", "fr"].includes(raw) ? raw : defaultLocale) as Locale;

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

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
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
              "@type": "SoftwareApplication",
              name: "KapitaalBot",
              applicationCategory: "FinanceApplication",
              description: t(lang, "hero.subline"),
            }),
          }}
        ></script>
        <Analytics />
      </body>
    </html>
  );
}
