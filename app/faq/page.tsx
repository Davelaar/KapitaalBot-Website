"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";

const FAQ_SECTIONS: { id: string; titleKey: string; items: { qKey: string; aKey: string }[] }[] = [
  {
    id: "seo",
    titleKey: "faq.section.seo.title",
    items: [
      { qKey: "faq.seo.q1", aKey: "faq.seo.a1" },
      { qKey: "faq.seo.q2", aKey: "faq.seo.a2" },
      { qKey: "faq.seo.q3", aKey: "faq.seo.a3" },
      { qKey: "faq.seo.q4", aKey: "faq.seo.a4" },
      { qKey: "faq.seo.q5", aKey: "faq.seo.a5" },
    ],
  },
  {
    id: "overview",
    titleKey: "faq.section.overview.title",
    items: [
      { qKey: "faq.overview.q1", aKey: "faq.overview.a1" },
      { qKey: "faq.overview.q2", aKey: "faq.overview.a2" },
      { qKey: "faq.overview.q3", aKey: "faq.overview.a3" },
      { qKey: "faq.overview.q4", aKey: "faq.overview.a4" },
      { qKey: "faq.overview.q5", aKey: "faq.overview.a5" },
      { qKey: "faq.overview.q6", aKey: "faq.overview.a6" },
      { qKey: "faq.overview.q7", aKey: "faq.overview.a7" },
      { qKey: "faq.overview.q8", aKey: "faq.overview.a8" },
      { qKey: "faq.overview.q9", aKey: "faq.overview.a9" },
      { qKey: "faq.overview.q10", aKey: "faq.overview.a10" },
      { qKey: "faq.overview.q11", aKey: "faq.overview.a11" },
      { qKey: "faq.overview.q12", aKey: "faq.overview.a12" },
    ],
  },
  {
    id: "architecture",
    titleKey: "faq.section.architecture.title",
    items: [
      { qKey: "faq.architecture.q1", aKey: "faq.architecture.a1" },
      { qKey: "faq.architecture.q2", aKey: "faq.architecture.a2" },
      { qKey: "faq.architecture.q3", aKey: "faq.architecture.a3" },
      { qKey: "faq.architecture.q4", aKey: "faq.architecture.a4" },
      { qKey: "faq.architecture.q5", aKey: "faq.architecture.a5" },
      { qKey: "faq.architecture.q6", aKey: "faq.architecture.a6" },
      { qKey: "faq.architecture.q7", aKey: "faq.architecture.a7" },
      { qKey: "faq.architecture.q8", aKey: "faq.architecture.a8" },
      { qKey: "faq.architecture.q9", aKey: "faq.architecture.a9" },
      { qKey: "faq.architecture.q10", aKey: "faq.architecture.a10" },
    ],
  },
  {
    id: "regimes_strategies",
    titleKey: "faq.section.regimes_strategies.title",
    items: [
      { qKey: "faq.regimes_strategies.q1", aKey: "faq.regimes_strategies.a1" },
      { qKey: "faq.regimes_strategies.q2", aKey: "faq.regimes_strategies.a2" },
      { qKey: "faq.regimes_strategies.q3", aKey: "faq.regimes_strategies.a3" },
      { qKey: "faq.regimes_strategies.q4", aKey: "faq.regimes_strategies.a4" },
      { qKey: "faq.regimes_strategies.q5", aKey: "faq.regimes_strategies.a5" },
      { qKey: "faq.regimes_strategies.q6", aKey: "faq.regimes_strategies.a6" },
      { qKey: "faq.regimes_strategies.q7", aKey: "faq.regimes_strategies.a7" },
      { qKey: "faq.regimes_strategies.q8", aKey: "faq.regimes_strategies.a8" },
      { qKey: "faq.regimes_strategies.q9", aKey: "faq.regimes_strategies.a9" },
      { qKey: "faq.regimes_strategies.q10", aKey: "faq.regimes_strategies.a10" },
    ],
  },
  {
    id: "risk_safety",
    titleKey: "faq.section.risk_safety.title",
    items: [
      { qKey: "faq.risk_safety.q1", aKey: "faq.risk_safety.a1" },
      { qKey: "faq.risk_safety.q2", aKey: "faq.risk_safety.a2" },
      { qKey: "faq.risk_safety.q3", aKey: "faq.risk_safety.a3" },
      { qKey: "faq.risk_safety.q4", aKey: "faq.risk_safety.a4" },
      { qKey: "faq.risk_safety.q5", aKey: "faq.risk_safety.a5" },
      { qKey: "faq.risk_safety.q6", aKey: "faq.risk_safety.a6" },
      { qKey: "faq.risk_safety.q7", aKey: "faq.risk_safety.a7" },
      { qKey: "faq.risk_safety.q8", aKey: "faq.risk_safety.a8" },
      { qKey: "faq.risk_safety.q9", aKey: "faq.risk_safety.a9" },
      { qKey: "faq.risk_safety.q10", aKey: "faq.risk_safety.a10" },
    ],
  },
  {
    id: "observability",
    titleKey: "faq.section.observability.title",
    items: [
      { qKey: "faq.observability.q1", aKey: "faq.observability.a1" },
      { qKey: "faq.observability.q2", aKey: "faq.observability.a2" },
      { qKey: "faq.observability.q3", aKey: "faq.observability.a3" },
      { qKey: "faq.observability.q4", aKey: "faq.observability.a4" },
      { qKey: "faq.observability.q5", aKey: "faq.observability.a5" },
      { qKey: "faq.observability.q6", aKey: "faq.observability.a6" },
      { qKey: "faq.observability.q7", aKey: "faq.observability.a7" },
      { qKey: "faq.observability.q8", aKey: "faq.observability.a8" },
      { qKey: "faq.observability.q9", aKey: "faq.observability.a9" },
      { qKey: "faq.observability.q10", aKey: "faq.observability.a10" },
    ],
  },
  {
    id: "validation",
    titleKey: "faq.section.validation.title",
    items: [
      { qKey: "faq.validation.q1", aKey: "faq.validation.a1" },
      { qKey: "faq.validation.q2", aKey: "faq.validation.a2" },
      { qKey: "faq.validation.q3", aKey: "faq.validation.a3" },
      { qKey: "faq.validation.q4", aKey: "faq.validation.a4" },
      { qKey: "faq.validation.q5", aKey: "faq.validation.a5" },
      { qKey: "faq.validation.q6", aKey: "faq.validation.a6" },
      { qKey: "faq.validation.q7", aKey: "faq.validation.a7" },
      { qKey: "faq.validation.q8", aKey: "faq.validation.a8" },
      { qKey: "faq.validation.q9", aKey: "faq.validation.a9" },
      { qKey: "faq.validation.q10", aKey: "faq.validation.a10" },
    ],
  },
  {
    id: "funding",
    titleKey: "faq.section.funding.title",
    items: [
      { qKey: "faq.funding.q1", aKey: "faq.funding.a1" },
      { qKey: "faq.funding.q2", aKey: "faq.funding.a2" },
      { qKey: "faq.funding.q3", aKey: "faq.funding.a3" },
      { qKey: "faq.funding.q4", aKey: "faq.funding.a4" },
      { qKey: "faq.funding.q5", aKey: "faq.funding.a5" },
    ],
  },
];

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
