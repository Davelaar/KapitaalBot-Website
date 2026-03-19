"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/HeaderLogo";

export function NavBar() {
  const locale = useLocale();
  const [accountOpen, setAccountOpen] = useState(false);

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
      <nav style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
        <Link href="/" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.system")}
        </Link>
        <Link href="/dashboard" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.data")}
        </Link>
        <Link href="/changelog" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.notes")}
        </Link>
        <Link href="/contact" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          Contact
        </Link>
        <Link href="/docs" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.architecture")}
        </Link>
        <Link href="/faq" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.research")}
        </Link>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setAccountOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--fg)",
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {t(locale, "nav.account") ?? "Account"}
          </button>
          {accountOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "1.75rem",
                minWidth: "160px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                padding: "0.35rem 0",
                zIndex: 20,
              }}
              role="menu"
            >
              <Link
                href="/tier2-request"
                style={{
                  display: "block",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.9rem",
                  color: "var(--fg)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setAccountOpen(false)}
              >
                {t(locale, "nav.access")}
              </Link>
              <Link
                href="/login"
                style={{
                  display: "block",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.9rem",
                  color: "var(--fg)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setAccountOpen(false)}
              >
                {t(locale, "nav.login")}
              </Link>
            </div>
          )}
        </div>
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
    </header>
  );
}
