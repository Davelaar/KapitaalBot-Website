"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/HeaderLogo";

export function NavBar() {
  const locale = useLocale();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (headerRef.current && target && !headerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [mobileOpen]);

  return (
    <header
      className="site-header"
      ref={headerRef}
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      <HeaderLogo />
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? t(locale, "nav.menu.close") : t(locale, "nav.menu.open")}
        aria-expanded={mobileOpen}
        style={{
          display: "none",
          border: "1px solid var(--border)",
          background: "var(--card-bg)",
          color: "var(--fg)",
          padding: "0.35rem 0.6rem",
          fontSize: "1rem",
          fontWeight: 700,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        {mobileOpen ? "×" : "☰"}
      </button>
      <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.system")}
        </Link>
        <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.data")}
        </Link>
        <Link href={withLocale(locale, "/kennis")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.kennis")}
        </Link>
        <Link href={withLocale(locale, "/over")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.about")}
        </Link>
        <Link href={withLocale(locale, "/changelog")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.notes")}
        </Link>
        <Link href={withLocale(locale, "/contact")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.contact")}
        </Link>
        <Link href={withLocale(locale, "/docs")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
          {t(locale, "nav.architecture")}
        </Link>
        <Link href={withLocale(locale, "/faq")} style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
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
                href={withLocale(locale, "/tier2-request")}
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
                href={withLocale(locale, "/login")}
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
      {mobileOpen && (
        <div
          className="mobile-nav-panel mobile-nav-panel--open"
          style={{
            display: "none",
            position: "absolute",
            left: "1rem",
            right: "1rem",
            top: "100%",
            marginTop: "0.4rem",
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--card-bg)",
            padding: "0.7rem",
            zIndex: 40,
          }}
        >
          <Link href={withLocale(locale, "/")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.system")}
          </Link>
          <Link href={withLocale(locale, "/dashboard")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.data")}
          </Link>
          <Link href={withLocale(locale, "/kennis")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.kennis")}
          </Link>
          <Link href={withLocale(locale, "/over")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.about")}
          </Link>
          <Link href={withLocale(locale, "/changelog")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.notes")}
          </Link>
          <Link href={withLocale(locale, "/contact")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.contact")}
          </Link>
          <Link href={withLocale(locale, "/docs")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.architecture")}
          </Link>
          <Link href={withLocale(locale, "/faq")} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.research")}
          </Link>
          <div className="mobile-nav-section">{t(locale, "nav.account") ?? "Account"}</div>
          <Link href={withLocale(locale, "/tier2-request")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.access")}
          </Link>
          <Link href={withLocale(locale, "/login")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.login")}
          </Link>
          <div className="mobile-nav-tools">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
