import type { Metadata } from "next";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HeaderLogo } from "@/components/HeaderLogo";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  title: "KapitaalBot — Observability",
  description:
    "Observability portal voor het autonome crypto trading systeem. Engineering showcase en informatief platform.",
  openGraph: {
    title: "KapitaalBot — Observability",
    description: "Live trading observability engine. Transparantie, realtime metrics, risk-first.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KapitaalBot — Observability",
    description: "Live trading observability engine. Transparantie, realtime metrics, risk-first.",
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
        <header
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "0.75rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <HeaderLogo />
          <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <a href="/dashboard" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>Dashboard</a>
            <a href="/tier2-request" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>Tier 2</a>
            <a href="/faq" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>FAQ</a>
            <a href="/admin" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem" }}>Admin</a>
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </header>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {children}
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
              description: "Observability portal voor het autonome crypto trading systeem.",
            }),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
