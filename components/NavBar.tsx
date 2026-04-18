"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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

const dropdownPanelStyle: CSSProperties = {
  position: "absolute",
  minWidth: "220px",
  borderRadius: 8,
  border: "1px solid var(--border-strong)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-soft)",
  padding: "0.35rem 0",
  zIndex: 20,
};

const dropdownLinkStyle: CSSProperties = {
  display: "block",
  padding: "0.4rem 0.9rem",
  fontSize: "0.9rem",
  color: "var(--text)",
  textDecoration: "none",
  whiteSpace: "normal",
};

function dropdownButtonStyle(activeSection: boolean): CSSProperties {
  return {
    background: "transparent",
    border: "none",
    color: activeSection ? "var(--text)" : "var(--text-secondary)",
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: "0.2rem 0",
    fontWeight: activeSection ? 600 : 500,
  };
}

export function NavBar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [docsOpen, setDocsOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [overOpen, setOverOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const active = (path: string) => pathActive(pathname, locale, path);
  const docsActive = active("/docs") || active("/spec");
  const updatesActive = active("/faq") || active("/changelog");
  const overActive = active("/over");
  const accessActive = active("/tier2-request") || active("/login");

  const closeAllDropdowns = () => {
    setDocsOpen(false);
    setUpdatesOpen(false);
    setOverOpen(false);
    setAccessOpen(false);
  };

  useEffect(() => {
    setDocsOpen(false);
    setUpdatesOpen(false);
    setOverOpen(false);
    setAccessOpen(false);
    setMobileOpen(false);
  }, [pathname]);

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
        closeAllDropdowns();
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

  const openOnlyDocs = () => {
    setUpdatesOpen(false);
    setOverOpen(false);
    setAccessOpen(false);
    setDocsOpen((v) => !v);
  };
  const openOnlyUpdates = () => {
    setDocsOpen(false);
    setOverOpen(false);
    setAccessOpen(false);
    setUpdatesOpen((v) => !v);
  };
  const openOnlyOver = () => {
    setDocsOpen(false);
    setUpdatesOpen(false);
    setAccessOpen(false);
    setOverOpen((v) => !v);
  };
  const openOnlyAccess = () => {
    setDocsOpen(false);
    setUpdatesOpen(false);
    setOverOpen(false);
    setAccessOpen((v) => !v);
  };

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
            onClick={openOnlyDocs}
            aria-haspopup="menu"
            aria-expanded={docsOpen}
            style={dropdownButtonStyle(docsActive)}
          >
            {t(locale, "nav.menu.docs")}
          </button>
          {docsOpen && (
            <div role="menu" style={{ ...dropdownPanelStyle, left: 0, top: "1.75rem" }}>
              <Link href={withLocale(locale, "/docs")} style={{ ...dropdownLinkStyle, whiteSpace: "nowrap" }} onClick={() => setDocsOpen(false)}>
                {t(locale, "nav.docs")}
              </Link>
              <Link href={withLocale(locale, "/spec")} style={{ ...dropdownLinkStyle, whiteSpace: "nowrap" }} onClick={() => setDocsOpen(false)}>
                {t(locale, "nav.spec.label")}
              </Link>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={openOnlyOver}
            aria-haspopup="menu"
            aria-expanded={overOpen}
            style={dropdownButtonStyle(overActive)}
          >
            {t(locale, "nav.about")}
          </button>
          {overOpen && (
            <div role="menu" style={{ ...dropdownPanelStyle, left: 0, top: "1.75rem" }}>
              <Link href={withLocale(locale, "/over")} style={{ ...dropdownLinkStyle, whiteSpace: "nowrap" }} onClick={() => setOverOpen(false)}>
                {t(locale, "nav.over.story")}
              </Link>
              <Link href={withLocale(locale, "/over/wat-is-kapitaalbot")} style={dropdownLinkStyle} onClick={() => setOverOpen(false)}>
                {t(locale, "nav.over.truth")}
              </Link>
              <Link href={withLocale(locale, "/over/bitvavo-vs-kraken")} style={dropdownLinkStyle} onClick={() => setOverOpen(false)}>
                {t(locale, "nav.over.bitvavoKraken")}
              </Link>
              <Link href={withLocale(locale, "/over/fundme")} style={dropdownLinkStyle} onClick={() => setOverOpen(false)}>
                {t(locale, "nav.fundme")}
              </Link>
              <Link href={withLocale(locale, "/over/toekomstvisie")} style={dropdownLinkStyle} onClick={() => setOverOpen(false)}>
                {t(locale, "nav.over.vision")}
              </Link>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={openOnlyUpdates}
            aria-haspopup="menu"
            aria-expanded={updatesOpen}
            style={dropdownButtonStyle(updatesActive)}
          >
            {t(locale, "nav.menu.updates")}
          </button>
          {updatesOpen && (
            <div role="menu" style={{ ...dropdownPanelStyle, left: 0, top: "1.75rem" }}>
              <Link href={withLocale(locale, "/faq")} style={{ ...dropdownLinkStyle, whiteSpace: "nowrap" }} onClick={() => setUpdatesOpen(false)}>
                {t(locale, "nav.faq")}
              </Link>
              <Link href={withLocale(locale, "/changelog")} style={{ ...dropdownLinkStyle, whiteSpace: "nowrap" }} onClick={() => setUpdatesOpen(false)}>
                {t(locale, "nav.changelog")}
              </Link>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={openOnlyAccess}
            aria-haspopup="menu"
            aria-expanded={accessOpen}
            style={dropdownButtonStyle(accessActive)}
          >
            {t(locale, "nav.menu.access")}
          </button>
          {accessOpen && (
            <div role="menu" style={{ ...dropdownPanelStyle, right: 0, left: "auto", top: "1.75rem" }}>
              <Link href={withLocale(locale, "/tier2-request")} style={{ ...dropdownLinkStyle, whiteSpace: "normal" }} onClick={() => setAccessOpen(false)}>
                {t(locale, "nav.tier2.request")}
              </Link>
              <Link href={withLocale(locale, "/login")} style={{ ...dropdownLinkStyle, whiteSpace: "nowrap" }} onClick={() => setAccessOpen(false)}>
                {t(locale, "nav.login")}
              </Link>
            </div>
          )}
        </div>

        <Link href={withLocale(locale, "/contact")} className={`nav-link${active("/contact") ? " nav-link--active" : ""}`}>
          {t(locale, "nav.contact")}
        </Link>

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

          <div className="mobile-nav-section">{t(locale, "nav.menu.docs")}</div>
          <Link href={withLocale(locale, "/docs")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.docs")}
          </Link>
          <Link href={withLocale(locale, "/spec")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.spec.label")}
          </Link>

          <div className="mobile-nav-section">{t(locale, "nav.about")}</div>
          <Link href={withLocale(locale, "/over")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.over.story")}
          </Link>
          <Link href={withLocale(locale, "/over/wat-is-kapitaalbot")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.over.truth")}
          </Link>
          <Link href={withLocale(locale, "/over/bitvavo-vs-kraken")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.over.bitvavoKraken")}
          </Link>
          <Link href={withLocale(locale, "/over/fundme")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.fundme")}
          </Link>
          <Link href={withLocale(locale, "/over/toekomstvisie")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.over.vision")}
          </Link>

          <div className="mobile-nav-section">{t(locale, "nav.menu.updates")}</div>
          <Link href={withLocale(locale, "/faq")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.faq")}
          </Link>
          <Link href={withLocale(locale, "/changelog")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.changelog")}
          </Link>

          <div className="mobile-nav-section">{t(locale, "nav.menu.access")}</div>
          <Link href={withLocale(locale, "/tier2-request")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.tier2.request")}
          </Link>
          <Link href={withLocale(locale, "/login")} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
            {t(locale, "nav.login")}
          </Link>

          <Link
            href={withLocale(locale, "/contact")}
            className={`mobile-nav-link${active("/contact") ? " mobile-nav-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.contact")}
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
