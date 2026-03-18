"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import type {
  PublicStatusSnapshot,
  PublicRegimeSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
  PublicDemoTrades,
} from "@/lib/snapshots";
import type { ProductionNoteRow } from "@/lib/read-cms";
import StatusStrip from "@/components/StatusStrip";
import MetricCardGrid from "@/components/MetricCardGrid";
import DemoTradeTeaser from "@/components/DemoTradeTeaser";
import { MermaidRenderer } from "@/components/MermaidRenderer";

const HOME_ARCH_DIAGRAM = `flowchart LR
  Ingest["Ingest (ticker/trades/L2/L3)"] --> State["State-first: run_symbol_state"]
  State --> Route["Route engine + universe selection"]
  Route --> Exec["Execution engine (queue-aware + safety)"]
  State --> Snap["Observability snapshots (read-model)"]
  Snap --> Tier1["Tier 1: public dashboards"]
  Snap --> Tier2["Tier 2: extended dashboards"]`;

interface HomePageContentProps {
  status: PublicStatusSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
  trading: PublicTradingSnapshot | null;
  demo: PublicDemoTrades | null;
  productionNotes: ProductionNoteRow[];
}

export function HomePageContent({
  status,
  regime,
  strategy,
  trading,
  demo,
  productionNotes,
}: HomePageContentProps) {
  const locale = useLocale();

  return (
    <>
      <section style={{ marginBottom: "2rem", padding: "1.5rem 1.25rem" }} className="card">
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          {t(locale, "hero.headline")}
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "56ch", fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {t(locale, "hero.subline")}
        </p>

        <div style={{ marginTop: "1rem" }}>
          <MermaidRenderer code={HOME_ARCH_DIAGRAM} id="home-arch-diagram" />
        </div>

        <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--muted)" }}>
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "hero.dataLink")}
          </Link>
        </p>
      </section>

      <StatusStrip status={status} />
      <MetricCardGrid
        status={status}
        trading={trading}
        regime={regime}
        strategy={strategy}
      />
      <DemoTradeTeaser demo={demo} maxItems={3} />

      <section style={{ marginTop: "2rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{t(locale, "home.whatItIs.title")}</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
          <li>{t(locale, "home.whatItIs.bullet1")}</li>
          <li>{t(locale, "home.whatItIs.bullet2")}</li>
          <li>{t(locale, "home.whatItIs.bullet3")}</li>
          <li>{t(locale, "home.whatItIs.bullet4")}</li>
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{t(locale, "home.howItWorks.title")}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "0.5rem" }}>
          {t(locale, "home.howItWorks.p1")}
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
          {t(locale, "home.howItWorks.p2")}
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{t(locale, "home.philosophy.title")}</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
          <li>{t(locale, "home.philosophy.bullet1")}</li>
          <li>{t(locale, "home.philosophy.bullet2")}</li>
          <li>{t(locale, "home.philosophy.bullet3")}</li>
          <li>{t(locale, "home.philosophy.bullet4")}</li>
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{t(locale, "home.production.title")}</h2>
        {productionNotes.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            {productionNotes.map((note, i) => (
              <li key={i}>
                <span style={{ color: "var(--fg)", fontWeight: 500 }}>{note.date}</span>: {note.text}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            Geen recente production notes. Strategy pauses, parameter reviews en monitoring events worden intern bijgehouden.
          </p>
        )}
      </section>

      <section style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
          {t(locale, "home.access.text")}{" "}
          <Link href="/tier2-request" style={{ color: "var(--accent)", textDecoration: "none" }}>{t(locale, "nav.access")}</Link>.
        </p>
      </section>
    </>
  );
}
