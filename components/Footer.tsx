"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function Footer() {
  const locale = useLocale();
  const linkStyle = { color: "var(--muted)", textDecoration: "none" as const };
  return (
    <footer
      style={{
        padding: "0.75rem 1rem",
        textAlign: "center",
        fontSize: "0.8125rem",
        color: "var(--muted)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.65rem 1rem",
        alignItems: "center",
      }}
    >
      <Link href="/kennis" style={linkStyle}>
        {t(locale, "nav.kennis")}
      </Link>
      <Link href="/faq" style={linkStyle}>
        {t(locale, "nav.research")}
      </Link>
      <Link href="/docs" style={linkStyle}>
        {t(locale, "nav.architecture")}
      </Link>
      <Link href="/tier2-request" style={linkStyle}>
        {t(locale, "nav.access")}
      </Link>
    </footer>
  );
}
