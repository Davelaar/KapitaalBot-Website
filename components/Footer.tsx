"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function Footer() {
  const locale = useLocale();
  return (
    <footer style={{ padding: "0.5rem 1rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
      <Link href="/tier2-request" style={{ color: "var(--muted)", textDecoration: "none" }}>
        {t(locale, "nav.access")}
      </Link>
    </footer>
  );
}
