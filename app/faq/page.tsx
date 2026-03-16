"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";

const FAQ_SECTIONS: { id: string; titleKey: string; items: { qKey: string; aKey: string }[] }[] = [
  {
    id: "overview",
    titleKey: "faq.section.overview.title",
    items: [
      { qKey: "faq.overview.q1", aKey: "faq.overview.a1" },
      { qKey: "faq.overview.q2", aKey: "faq.overview.a2" },
      { qKey: "faq.overview.q3", aKey: "faq.overview.a3" },
    ],
  },
  {
    id: "architecture",
    titleKey: "faq.section.architecture.title",
    items: [
      { qKey: "faq.architecture.q1", aKey: "faq.architecture.a1" },
      { qKey: "faq.architecture.q2", aKey: "faq.architecture.a2" },
    ],
  },
  {
    id: "regimes_strategies",
    titleKey: "faq.section.regimes_strategies.title",
    items: [
      { qKey: "faq.regimes_strategies.q1", aKey: "faq.regimes_strategies.a1" },
      { qKey: "faq.regimes_strategies.q2", aKey: "faq.regimes_strategies.a2" },
      { qKey: "faq.regimes_strategies.q3", aKey: "faq.regimes_strategies.a3" },
    ],
  },
  {
    id: "risk_safety",
    titleKey: "faq.section.risk_safety.title",
    items: [
      { qKey: "faq.risk_safety.q1", aKey: "faq.risk_safety.a1" },
      { qKey: "faq.risk_safety.q2", aKey: "faq.risk_safety.a2" },
    ],
  },
  {
    id: "observability",
    titleKey: "faq.section.observability.title",
    items: [
      { qKey: "faq.observability.q1", aKey: "faq.observability.a1" },
      { qKey: "faq.observability.q2", aKey: "faq.observability.a2" },
    ],
  },
  {
    id: "validation",
    titleKey: "faq.section.validation.title",
    items: [
      { qKey: "faq.validation.q1", aKey: "faq.validation.a1" },
      { qKey: "faq.validation.q2", aKey: "faq.validation.a2" },
    ],
  },
];

export default function FAQPage() {
  const locale = useLocale();
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenSectionId((current) => (current === id ? null : id));
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "faq.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {t(locale, "faq.intro")}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {FAQ_SECTIONS.map((section) => {
          const isOpen = openSectionId === section.id;
          const panelId = `faq-panel-${section.id}`;
          const buttonId = `faq-toggle-${section.id}`;

          return (
            <section key={section.id} className="card">
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
