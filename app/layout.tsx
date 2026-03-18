import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { defaultLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "KapitaalBot — System",
  description:
    "Autonome trading runtime. Gecontroleerd, state-first, observeerbaar. Geen performance claims; read-model snapshots en operationele context.",
  openGraph: {
    title: "KapitaalBot — System",
    description: "Autonome trading runtime. Gecontroleerd, state-first, observeerbaar.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KapitaalBot — System",
    description: "Autonome trading runtime. Gecontroleerd, state-first, observeerbaar.",
  },
};

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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "KapitaalBot",
              applicationCategory: "FinanceApplication",
              description: "Autonome trading runtime. Gecontroleerd, state-first, observeerbaar.",
            }),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
