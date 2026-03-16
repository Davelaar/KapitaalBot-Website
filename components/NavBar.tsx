"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/HeaderLogo";

export function NavBar() {
  const locale = useLocale();
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <HeaderLogo />
      <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.system")}
        </Link>
        <Link href="/dashboard" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.data")}
        </Link>
        <Link href="/changelog" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.notes")}
        </Link>
        <Link href="/docs" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.architecture")}
        </Link>
        <Link href="/faq" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.research")}
        </Link>
        <Link href="/tier2-request" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.access")}
        </Link>
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
    </header>
  );
}
