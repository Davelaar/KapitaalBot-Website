import Link from "next/link";
import { StatusStrip } from "@/components/StatusStrip";
import { MetricCardGrid } from "@/components/MetricCardGrid";

export default function HomePage() {
  return (
    <main>
      <section style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          KapitaalBot
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "60ch" }}>
          Multi-regime trading runtime · Multi-strategy execution engine ·
          Autonoom long-running systeem · Risk-guarded · DB-first · Volledig
          observeerbaar.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "var(--accent)",
            color: "#0f1419",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Bekijk status
        </Link>
      </section>

      <StatusStrip />
      <MetricCardGrid />

      <section style={{ marginTop: "2rem" }} className="card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Architectuur (conceptueel)
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Ingest → Epochs/Snapshots → Execution pipeline → Orders/Fills. Regime
          detection → Strategy selection → Readiness gate → Route ranking. Mermaid
          build-time SVG komt in volgende iteratie.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }} className="card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Tier 2-toegang
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          Meer detail: execution dashboards, latency, strategy activity, shadow
          trades. Handmatig toegekend.
        </p>
        <a
          href="/tier2-request"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Vraag toegang (Tier 2)
        </a>
      </section>
    </main>
  );
}
