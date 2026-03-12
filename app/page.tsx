import Link from "next/link";
import {
  getPublicStatusSnapshot,
  getPublicRegimeSnapshot,
  getPublicStrategySnapshot,
  getPublicTradingSnapshot,
  getPublicDemoTrades,
} from "@/lib/read-snapshots";
import StatusStrip from "@/components/StatusStrip";
import MetricCardGrid from "@/components/MetricCardGrid";
import DemoTradeTeaser from "@/components/DemoTradeTeaser";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();
  const demo = getPublicDemoTrades();

  return (
    <main>
      {/* Hero */}
      <section style={{ marginBottom: "2rem", padding: "1.5rem" }} className="card">
        <p style={{ fontSize: "0.8125rem", color: "var(--accent)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Observability
        </p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Live Trading Observability Engine
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "60ch" }}>
          Transparantie · realtime metrics · risk-first. KapitaalBot toont
          status, regimes, strategieën en execution-overview op basis van
          snapshot-data.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "var(--accent)",
            color: "#0f1419",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Bekijk status
        </Link>
      </section>

      {/* Waarom KapitaalBot */}
      <section style={{ marginTop: "2rem" }} className="card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          Waarom KapitaalBot
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
          <li><strong style={{ color: "var(--fg)" }}>Capital preservation first</strong> — risk guards en safety modes.</li>
          <li><strong style={{ color: "var(--fg)" }}>DB-first architecture</strong> — epochs, snapshots, geen losse state.</li>
          <li><strong style={{ color: "var(--fg)" }}>Autonomous runtime</strong> — multi-regime, multi-strategy execution.</li>
          <li><strong style={{ color: "var(--fg)" }}>Real execution metrics</strong> — vertraagde maar echte data uit de bot.</li>
        </ul>
      </section>

      {/* How Observability Works */}
      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          How Observability Works
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "0.5rem" }}>
          De bot exporteert read-model snapshots (JSON). Deze site leest alleen
          die bestanden — geen directe database-toegang.
        </p>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
          <li><strong style={{ color: "var(--fg)" }}>Snapshots</strong> — status, regime, strategy, market, trading, demo trades.</li>
          <li><strong style={{ color: "var(--fg)" }}>Epochs</strong> — gebonden execution-cycles.</li>
          <li><strong style={{ color: "var(--fg)" }}>Regime detection</strong> — actieve regimes en dominant.</li>
          <li><strong style={{ color: "var(--fg)" }}>Safety guards</strong> — normal, exit_only, hard_blocked.</li>
        </ul>
      </section>

      {/* Tier Access Model */}
      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          Tier Access Model
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
          <li><strong style={{ color: "var(--fg)" }}>Tier 1</strong> — Publieke snapshots: status, metrics, regime/strategy, market, demo.</li>
          <li><strong style={{ color: "var(--fg)" }}>Tier 2</strong> — Extended insights: execution dashboards, latency, strategy activity.</li>
          <li><strong style={{ color: "var(--fg)" }}>Tier 3</strong> — Internal telemetry en admin.</li>
        </ul>
        <Link
          href="/tier2-request"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Vraag toegang (Tier 2)
        </Link>
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
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Architectuur (conceptueel)
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Ingest → Epochs/Snapshots → Execution pipeline → Orders/Fills. Regime
          detection → Strategy selection → Readiness gate → Route ranking.
        </p>
      </section>
    </main>
  );
}
