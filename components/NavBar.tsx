"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import { t, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/HeaderLogo";

function pathActive(pathname: string | null, locale: Locale, path: string): boolean {
  const href = withLocale(locale, path);
  if (path === "/") return pathname === href;
  return pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
}

export function NavBar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [overOpen, setOverOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const active = (path: string) => pathActive(pathname, locale, path);

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
    <header className="site-header" ref={headerRef}>
      <HeaderLogo />
      <button
        type="button"
        className="mobile-nav-toggle kb-theme-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? t(locale, "nav.menu.close") : t(locale, "nav.menu.open")}
        aria-expanded={mobileOpen}
        style={{
          display: "none",
        }}
      >
        {mobileOpen ? "×" : "☰"}
      </button>
      <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
        <Link href={withLocale(locale, "/")} className={`nav-link${active("/") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.system")}
        </Link>
        <Link href={withLocale(locale, "/dashboard")} className={`nav-link${active("/dashboard") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.data")}
        </Link>
        <Link href={withLocale(locale, "/kennis")} className={`nav-link${active("/kennis") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.kennis")}
        </Link>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setOverOpen((v) => !v);
              setAccountOpen(false);
            }}
            aria-haspopup="menu"
            aria-expanded={overOpen}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: "0.2rem 0",
              fontWeight: 500,
            }}
          >
            {t(locale, "nav.about")}
          </button>
          {overOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                left: 0,
                top: "1.75rem",
                minWidth: "220px",
                borderRadius: 8,
                border: "1px solid var(--border-strong)",
                background: "var(--surface)",
                boxShadow: "var(--shadow-soft)",
                padding: "0.35rem 0",
                zIndex: 20,
              }}
            >
              <Link
                href={withLocale(locale, "/over")}
                style={{
                  display: "block",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.9rem",
                  color: "var(--text)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setOverOpen(false)}
              >
                {t(locale, "nav.over.story")}
              </Link>
              <Link
                href={withLocale(locale, "/over/wat-is-kapitaalbot")}
                style={{
                  display: "block",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.9rem",
                  color: "var(--text)",
                  textDecoration: "none",
                  whiteSpace: "normal",
                }}
                onClick={() => setOverOpen(false)}
              >
                {t(locale, "nav.over.truth")}
              </Link>
            </div>
          )}
        </div>
        <Link href={withLocale(locale, "/changelog")} className={`nav-link${active("/changelog") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.notes")}
        </Link>
        <Link href={withLocale(locale, "/contact")} className={`nav-link${active("/contact") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.contact")}
        </Link>
        <Link href={withLocale(locale, "/docs")} className={`nav-link${active("/docs") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.architecture")}
        </Link>
        <Link href={withLocale(locale, "/spec")} className={`nav-link${active("/spec") ? " nav-link--active" : ""}`}>
          SPEC
        </Link>
        <Link href={withLocale(locale, "/faq")} className={`nav-link${active("/faq") ? " nav-link--active" : ""}`}>
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
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: "0.2rem 0",
              fontWeight: 500,
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
                border: "1px solid var(--border-strong)",
                background: "var(--surface)",
                boxShadow: "var(--shadow-soft)",
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
                  color: "var(--text)",
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
                  color: "var(--text)",
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
            border: "1px solid var(--border-strong)",
            borderRadius: 10,
            background: "var(--surface)",
            padding: "0.7rem",
            zIndex: 40,
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <Link
            href={withLocale(locale, "/")}
            className={`mobile-nav-link${active("/") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.system")}
          </Link>
          <Link
            href={withLocale(locale, "/dashboard")}
            className={`mobile-nav-link${active("/dashboard") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.data")}
          </Link>
          <Link
            href={withLocale(locale, "/kennis")}
            className={`mobile-nav-link${active("/kennis") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.kennis")}
          </Link>
          <div className="mobile-nav-section">{t(locale, "nav.about")}</div>
          <Link href={withLocale(locale, "/over")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.over.story")}
          </Link>
          <Link
            href={withLocale(locale, "/over/wat-is-kapitaalbot")}
            className="mobile-nav-link mobile-nav-sub"
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.over.truth")}
          </Link>
          <Link
            href={withLocale(locale, "/changelog")}
            className={`mobile-nav-link${active("/changelog") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.notes")}
          </Link>
          <Link
            href={withLocale(locale, "/contact")}
            className={`mobile-nav-link${active("/contact") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.contact")}
          </Link>
          <Link
            href={withLocale(locale, "/docs")}
            className={`mobile-nav-link${active("/docs") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.architecture")}
          </Link>
          <Link
            href={withLocale(locale, "/spec")}
            className={`mobile-nav-link${active("/spec") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            SPEC
          </Link>
          <Link
            href={withLocale(locale, "/faq")}
            className={`mobile-nav-link${active("/faq") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
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
