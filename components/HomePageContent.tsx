"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
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
import RecentExecutionSection from "@/components/RecentExecutionSection";
import { MermaidLiveDiagram } from "@/components/MermaidLiveDiagram";

interface HomePageContentProps {
  status: PublicStatusSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
  trading: PublicTradingSnapshot | null;
  demo: PublicDemoTrades | null;
  productionNotes: ProductionNoteRow[];
  notices: string[];
}

export function HomePageContent({
  status,
  regime,
  strategy,
  trading,
  demo,
  productionNotes,
  notices,
}: HomePageContentProps) {
  const locale = useLocale();
  const homeArchDiagram = `
flowchart LR
  Ingest["${t(locale, "diagram.home.arch.node.ingest")}"] --> State["${t(locale, "diagram.home.arch.node.state")}"]
  State --> Route["${t(locale, "diagram.home.arch.node.route")}"]
  Route --> Exec["${t(locale, "diagram.home.arch.node.exec")}"]
  State --> Snap["${t(locale, "diagram.home.arch.node.snap")}"]
  Snap --> Tier1["${t(locale, "diagram.home.arch.node.tier1")}"]
  Snap --> Tier2["${t(locale, "diagram.home.arch.node.tier2")}"]
`;

  return (
    <>
      <section style={{ marginBottom: "2rem", padding: "1.5rem 1.25rem" }} className="card">
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          {t(locale, "hero.headline")}
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "56ch", fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {t(locale, "hero.subline")}
        </p>

        <div style={{ marginTop: "1rem" }} className="markdown-body">
          <MermaidLiveDiagram chart={homeArchDiagram} seoKeyPrefix="diagram.home.arch" />
        </div>

        <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--muted)" }}>
          <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "hero.dataLink")}
          </Link>
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem" }} className="card">
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 600 }}>{t(locale, "home.seoStrip.title")}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          {t(locale, "home.seoStrip.intro")}
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          <Link href={withLocale(locale, "/kennis/kraken-l3-orderbook-bot")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "home.seoStrip.anchor.l3")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/kennis/kraken-websocket-api-spot")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "home.seoStrip.anchor.ws")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/kennis/kraken-hybrid-maker-fees")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "home.seoStrip.anchor.maker")}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/kennis/crypto-regime-detectie")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {t(locale, "home.seoStrip.anchor.regime")}
          </Link>
        </p>
        <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
          <Link href={withLocale(locale, "/kennis")} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
            {t(locale, "home.seoStrip.cta")}
          </Link>
        </p>
      </section>

      {notices.length > 0 && (
        <section style={{ marginBottom: "1.5rem" }} className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{t(locale, "home.notices.title")}</h2>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
            {notices.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      <StatusStrip status={status} />
      <MetricCardGrid
        status={status}
        trading={trading}
        regime={regime}
        strategy={strategy}
      />
      <RecentExecutionSection trading={trading} maxOrders={10} maxFills={10} />
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
            {t(locale, "home.production.empty")}
          </p>
        )}
      </section>

      <section style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
          {t(locale, "home.access.text")}{" "}
          <Link href={withLocale(locale, "/tier2-request")} style={{ color: "var(--accent)", textDecoration: "none" }}>{t(locale, "nav.access")}</Link>.
        </p>
      </section>
    </>
  );
}
