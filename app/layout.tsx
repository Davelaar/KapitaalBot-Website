import type { Metadata } from "next";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "KapitaalBot — Observability",
  description:
    "Observability portal voor het autonome crypto trading systeem. Engineering showcase en informatief platform.",
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
          <a href="/" style={{ color: "var(--fg)", textDecoration: "none", fontWeight: 600 }}>
            KapitaalBot
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <a href="/dashboard" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>Dashboard</a>
            <a href="/faq" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>FAQ</a>
            <ThemeToggle />
          </nav>
        </header>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {children}
          <ComplianceBanner />
        </div>
      </body>
    </html>
  );
}
