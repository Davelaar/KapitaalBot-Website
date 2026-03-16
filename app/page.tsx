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
      {/* Hero — sober, geen harde CTA boven de vouw */}
      <section style={{ marginBottom: "2rem", padding: "1.5rem 1.25rem" }} className="card">
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          Autonome trading runtime. Gecontroleerd, state-first, observeerbaar.
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "56ch", fontSize: "0.9375rem", lineHeight: 1.6 }}>
          Capital preservation first. Execution discipline. Read-model snapshots; geen realtime signalen of orderfeed.
        </p>
        <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--muted)" }}>
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
            Data →
          </Link>
        </p>
      </section>

      {/* Observed behaviour — metrics */}
      <StatusStrip status={status} />
      <MetricCardGrid
        status={status}
        trading={trading}
        regime={regime}
        strategy={strategy}
      />
      <DemoTradeTeaser demo={demo} maxItems={3} />

      {/* What it is */}
      <section style={{ marginTop: "2rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>What it is</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
          <li><strong style={{ color: "var(--fg)" }}>Capital preservation bias</strong> — risk guards, safety modes, exposure caps.</li>
          <li><strong style={{ color: "var(--fg)" }}>Execution discipline</strong> — state-first, epochs, geen losse state.</li>
          <li><strong style={{ color: "var(--fg)" }}>Multi-asset microstructure awareness</strong> — filtering, suitability, L3-quality.</li>
          <li><strong style={{ color: "var(--fg)" }}>Adaptive throttling</strong> — inactivity under uncertainty; strategy components disableable.</li>
        </ul>
      </section>

      {/* How it works (abstracted) */}
      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>How it works (abstracted)</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "0.5rem" }}>
          Market Data → Filtering layer → Opportunity scoring → Execution engine → Risk envelope → Feedback loop.
          Guardrails: exposure caps, kill conditions, monitoring, logging, failure isolation.
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
          Geen parameters, thresholds of venue-details gepubliceerd.
        </p>
      </section>

      {/* System philosophy */}
      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>System philosophy</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
          <li>The system prefers inactivity over uncertainty.</li>
          <li>Losses must remain explainable.</li>
          <li>Capital deployment requires measurable conditions.</li>
          <li>Strategy components can be disabled without total failure.</li>
        </ul>
      </section>

      {/* Production notes (placeholder) */}
      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Production notes</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Strategy pauses, parameter reviews, volatility regime changes, execution constraint updates en monitoring events worden intern bijgehouden. Geen publieke event-feed.
        </p>
      </section>

      {/* Access — subtiel, geen CTA-push */}
      <section style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
          Voor private inquiry of research dialogue: <Link href="/tier2-request" style={{ color: "var(--accent)", textDecoration: "none" }}>Access</Link>.
        </p>
      </section>
    </main>
  );
}
