import type { Metadata } from "next";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
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
