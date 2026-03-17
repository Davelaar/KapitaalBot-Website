"use client";

import Link from "next/link";
import { MermaidRenderer } from "@/components/MermaidRenderer";
import type {
  Tier2ExecutionSnapshot,
  Tier2LatencySnapshot,
  Tier2PnlSnapshot,
  Tier2SafetySnapshot,
} from "@/lib/snapshots";

const TIER_FLOW = `flowchart LR
  Tier1["Tier 1 (publiek)"] --> Tier2["Tier 2 (op aanvraag)"]
  Tier2 --> Tier3["Tier 3 (admin)"]

  Tier1 --> SnapPublic["public_* snapshots"]
  Tier2 --> SnapTier2["tier2_* snapshots"]
  Tier3 --> SnapAdmin["admin_observability_snapshot"]`;

const BOT_FLOW = `flowchart TB
  BotEngine["Krakenbot Engine"] --> Export["export-observability-snapshots"]
  Export --> Dir["OBSERVABILITY_EXPORT_DIR"]
  Dir --> SiteTier1["KapitaalBot Observability (Tier 1)"]
  Dir --> SiteTier2["KapitaalBot Observability (Tier 2)"]`;

interface DashboardTier2ContentProps {
  execution: Tier2ExecutionSnapshot | null;
  latency: Tier2LatencySnapshot | null;
  pnl: Tier2PnlSnapshot | null;
  safety: Tier2SafetySnapshot | null;
}

export function DashboardTier2Content({ execution, latency, pnl, safety }: DashboardTier2ContentProps) {
  const hasAny =
    execution !== null || latency !== null || pnl !== null || safety !== null;

  return (
    <>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Dashboard
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Dashboard Tier 2
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Uitgebreide observability uit <code>tier2_*</code> snapshots. Echte data; geen placeholders.
      </p>

      {!hasAny && (
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Geen Tier 2-data</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", margin: 0 }}>
            Er zijn nog geen <code>tier2_*</code> snapshot-bestanden. Voer op de bot <code>export-observability-snapshots</code> uit; daarna verschijnen hier de modules.
          </p>
          <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9375rem" }}>
              → Ga naar Data (Tier 1)
            </Link>
          </p>
        </div>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Execution (24h)</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            Orders: <strong style={{ color: "var(--fg)" }}>{execution.orders_24h_count}</strong> · Fills: <strong style={{ color: "var(--fg)" }}>{execution.fills_24h_count}</strong>
            {execution.exported_at && (
              <span style={{ marginLeft: "0.5rem" }}>(export {execution.exported_at})</span>
            )}
          </p>
        </section>
      )}
      {latency && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Latency (submit→ack)</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            {latency.submit_to_ack_ms_avg != null
              ? `Gemiddeld ${Math.round(latency.submit_to_ack_ms_avg)} ms (n=${latency.sample_count})`
              : `Geen samples (n=${latency.sample_count})`}
          </p>
        </section>
      )}
      {pnl && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>PnL (24h)</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            Gerealiseerd PnL (quote): {pnl.realized_pnl_quote_24h != null ? pnl.realized_pnl_quote_24h.toFixed(2) : "—"}
          </p>
        </section>
      )}
      {safety && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Safety</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            Normal: <strong style={{ color: "var(--fg)" }}>{safety.safety_normal_count}</strong> · Exit-only: {safety.safety_exit_only_count} · Hard-blocked: {safety.safety_hard_blocked_count}
          </p>
        </section>
      )}

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Tier-model & dataflow (conceptueel)</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          Onderstaande diagrammen volgen de SSOT-engine-documentatie. Ze tonen hoe Tier 1, Tier 2 en Tier 3
          observability op elkaar aansluiten. De data zelf komt uitsluitend uit read-model snapshots; geen directe
          DB-query's vanaf de website.
        </p>
        <MermaidRenderer code={TIER_FLOW} id="tier-flow" />
        <MermaidRenderer code={BOT_FLOW} id="bot-flow" />
      </section>
    </>
  );
}
