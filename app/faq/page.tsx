"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";

type FaqItem = { q: string; a: string };

interface FaqSection {
  id: string;
  title: string;
  items: FaqItem[];
}

/**
 * FAQ (sectie 12) + FAQ-chatbot (RAG-preview), gecategoriseerd.
 * Categorieën worden als accordion getoond; vragen/antwoorden klappen uit per categorie.
 */
export default function FAQPage() {
  const locale = useLocale();
  const sections: FaqSection[] = [
    {
      id: "overview",
      title: "Overzicht & scope",
      items: [
        {
          q: "Wat is KapitaalBot?",
          a: "KapitaalBot is een autonoom crypto trading systeem dat op ruim 600 spotmarkten draait. De engine is multi-regime (bijv. range, trend, high-volatility, low-liquidity) en multi-strategy (bijv. liquidity-, momentum- en volumegerichte strategieën). Deze site toont alleen observability-data over die runtime, geen live orders of realtime signalen.",
        },
        {
          q: "Waarom vertraagde data op Tier 1?",
          a: "Tier 1 is bedoeld als observability-laag: transparantie en uitleg zonder realtime signal-gedrag of reverse-engineering te faciliteren. Je ziet run-status, regime- en strategy-overviews, symbol-tellers en geaggregeerde metrics; geen live orderfeed.",
        },
        {
          q: "Wat is het verschil tussen Tier 1, Tier 2 en Tier 3?",
          a: "Tier 1 is publiek: statusstrip, regimes, strategieën, handelstellers, market/pair summary en demo trades op basis van public_* snapshots. Tier 2 is op aanvraag en voegt extra observability-modules toe, zoals execution- en latencydashboards, uitgebreidere trading-statistieken en shadow-trades. Tier 3 is intern (admin-observability) en bevat volledige lifecycle- en debug-telemetrie.",
        },
      ],
    },
    {
      id: "architecture",
      title: "Architectuur & dataflow",
      items: [
        {
          q: "Hoe loopt data van exchange naar KapitaalBot?",
          a: "Ingest verbindt op meerdere public WebSockets (ticker, trades, L2, L3) en schrijft raw-data in een ingest-DB. Daaruit wordt per run een state-tabel opgebouwd (run_symbol_state). De route-engine en execution lezen alleen uit die state (state-first); observability-snapshots lezen geaggregeerde informatie uit dezelfde database.",
        },
        {
          q: "Wat bedoelen jullie met state-first architectuur?",
          a: "In plaats van direct uit raw marketdata te beslissen, wordt eerst een compacte state per symbol opgebouwd en geüpdatet. Evaluatie, regime-detectie, strategie-keuze en execution gebruiken uitsluitend die state. Dat voorkomt meerdere waarheden, maakt safety/freshness beter controleerbaar en maakt auditing eenvoudiger.",
        },
      ],
    },
    {
      id: "regimes-strategies",
      title: "Regimes, strategieën & selectie",
      items: [
        {
          q: "Welke regimes kent KapitaalBot in grote lijnen?",
          a: "De engine classificeert markten in een paar hoofdregimes, zoals RANGE, TREND, HIGH_VOLATILITY, LOW_LIQUIDITY en CHAOS. Elk regime beschrijft het karakter van de markt (bijv. mean-reverting versus trendend, rustig versus zeer volatiel).",
        },
        {
          q: "Wat betekent multi-strategy in dit systeem?",
          a: "Per regime zijn verschillende strategie-families beschikbaar (bijvoorbeeld liquidity-, momentum- en volumegerichte benaderingen). Voor een symbol kiest de engine een passende strategie op basis van kenmerken van de markt en het regime, zonder dat die keuze als vaste rule-set wordt blootgelegd.",
        },
        {
          q: "Hoe wordt uit honderden markten een kleine subset gekozen om te traden?",
          a: "Voor elk symbol worden kenmerken gemeten (liquiditeit, spreads, volatiliteit, stabiliteit van prijsbewegingen, L3-kwaliteit, enz.). De route-engine maakt op basis daarvan één of enkele kansrijke kandidaat-routes per symbol en rangschikt die op verwachte netto-voordeel versus risico en tijd. Per evaluatie-cyclus wordt hoogstens een klein aantal symbols daadwerkelijk geselecteerd.",
        },
      ],
    },
    {
      id: "risk-safety",
      title: "Risk & safety",
      items: [
        {
          q: "Hoe beperkt KapitaalBot risico per trade en per account?",
          a: "De live engine gebruikt vaste limieten voor o.a. maximale inzet per trade en totaal beschikbaar kapitaal. Daarnaast zijn er safety-modi (normal, exit-only, hard-blocked) die symbolen tijdelijk of permanent uitsluiten wanneer de data of marktcondities niet betrouwbaar genoeg zijn.",
        },
        {
          q: "Hoe wordt stale data voorkomen?",
          a: "Voor elke evaluatie wordt state ververst. Bovendien gelden per route-type maximale leeftijden voor data; als die overschreden worden, wordt een route geblokkeerd en logt de engine dit expliciet. Daarnaast bewaakt een generatie-gate dat execution alleen gebeurt op state die zichtbaar en recent is op de decision-DB.",
        },
      ],
    },
    {
      id: "observability",
      title: "Observability & tiers",
      items: [
        {
          q: "Welke snapshots gebruikt de observability-website?",
          a: "Tier 1 leest public_status_snapshot.json, public_regime_snapshot.json, public_strategy_snapshot.json, public_market_snapshot.json, public_trading_snapshot.json en public_demo_trades.json. In volgende iteraties komen daar tier2_* snapshots en admin_observability_snapshot bij, die meer detail bevatten maar niet publiek zijn.",
        },
        {
          q: "Wat zie ik extra op Tier 2?",
          a: "Tier 2 biedt extra dashboards rond execution, latency, safety en shadow-trades. In plaats van alleen geaggregeerde tellers per run kun je daar de verdeling van execution-uitkomsten, latency-profielen en safety-events per module zien. De precieze strategie-logica blijft daarbij abstract.",
        },
      ],
    },
    {
      id: "validation",
      title: "Validatie & auditing",
      items: [
        {
          q: "Hoe bewijzen jullie dat de engine correct draait?",
          a: "Het validatiemodel bestaat uit bootstrap-, attach-, evaluation- en lifecycle-proofs. Die combineren logmarkers (bijv. EXECUTION_ENGINE_START, LIVE_EVALUATION_*, DATA_INTEGRITY_*, ROUTE_FRESHNESS_*) met database-tabellen (orders, fills, state) om te laten zien dat een run van start tot fill consistent is.",
        },
        {
          q: "Welke documentatie is leidend voor de engine?",
          a: "ENGINE_SSOT.md is de formele single source of truth. Daaronder vallen ARCHITECTURE_ENGINE_CURRENT.md voor de architectuur, LIVE_RUNBOOK_CURRENT.md voor het runbook en VALIDATION_MODEL_CURRENT.md voor het validatiemodel.",
        },
      ],
    },
  ];

  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenSectionId((current) => (current === id ? null : id));
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "faq.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {t(locale, "faq.intro")}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {sections.map((section) => {
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
                <span>{section.title}</span>
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
                  {section.items.map(({ q, a }) => (
                    <div key={q} className="card" style={{ marginBottom: 0 }}>
                      <h3 style={{ fontSize: "1.0rem", marginBottom: "0.35rem" }}>{q}</h3>
                      <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>{a}</p>
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
