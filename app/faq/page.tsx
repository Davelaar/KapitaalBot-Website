"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";
import { FAQ_SECTIONS } from "@/lib/faq-sections";

export default function FAQPage() {
  const locale = useLocale();
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function applyFundingHash() {
      if (typeof window === "undefined") return;
      if (window.location.hash !== "#funding") return;
      setOpenSectionId("funding");
      requestAnimationFrame(() => {
        document.getElementById("funding")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    applyFundingHash();
    window.addEventListener("hashchange", applyFundingHash);
    return () => window.removeEventListener("hashchange", applyFundingHash);
  }, []);

  function toggleSection(id: string) {
    setOpenSectionId((current) => (current === id ? null : id));
  }

  const searchLower = search.trim().toLowerCase();
  const filteredSections = searchLower
    ? FAQ_SECTIONS.map((section) => {
        const matchingItems = section.items.filter(
          (item) =>
            t(locale, item.qKey).toLowerCase().includes(searchLower) ||
            t(locale, item.aKey).toLowerCase().includes(searchLower)
        );
        return matchingItems.length > 0 ? { ...section, items: matchingItems } : null;
      }).filter(Boolean) as typeof FAQ_SECTIONS
    : FAQ_SECTIONS;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "faq.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        {t(locale, "faq.intro")}
      </p>
      <input
        type="search"
        placeholder={t(locale, "faq.search.placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label={t(locale, "faq.search.ariaLabel")}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "0.5rem 0.75rem",
          marginBottom: "1.5rem",
          border: "1px solid var(--border)",
          borderRadius: 4,
          background: "var(--bg)",
          color: "var(--fg)",
          fontSize: "0.9375rem",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {filteredSections.map((section) => {
          const isOpen = openSectionId === section.id;
          const panelId = `faq-panel-${section.id}`;
          const buttonId = `faq-toggle-${section.id}`;

          return (
            <section key={section.id} id={section.id} className="card">
              <button
                id={buttonId}
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  color: "var(--fg)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                }}
              >
                <span>{t(locale, section.titleKey)}</span>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "1.2rem",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  ▸
                </span>
              </button>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
                >
                  {section.items.map(({ qKey, aKey }) => (
                    <div key={qKey} className="card" style={{ marginBottom: 0 }}>
                      <h3 style={{ fontSize: "1.0rem", marginBottom: "0.35rem" }}>{t(locale, qKey)}</h3>
                      <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>{t(locale, aKey)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
      <FaqChatbot />
    </main>
  );
}
