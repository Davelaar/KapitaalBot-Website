"use client";

import Link from "next/link";
import { MermaidRenderer } from "@/components/MermaidRenderer";
import type {
  EventBufferKpis,
  LabelCount,
  MissedMoveBucket,
  RunHealthPoint,
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

function formatRunHealthPoint(p: RunHealthPoint | null | undefined): string {
  if (!p) return "Geen recente run-health sample.";
  const freshness = p.feed_freshness_secs != null ? `${Math.round(p.feed_freshness_secs)} s` : "n.v.t.";
  return `Run ${p.run_id} · mode=${p.mode ?? "onbekend"} · feed freshness ~${freshness}`;
}

function summarizeLabelCounts(rows: LabelCount[] | null | undefined): string {
  if (!rows || rows.length === 0) return "geen data";
  return rows
    .map((r) => `${r.label}: ${r.count}`)
    .join(" · ");
}

function summarizeMissedMoves(rows: MissedMoveBucket[] | null | undefined): string {
  if (!rows || rows.length === 0) return "geen metingen";
  const total = rows.reduce((acc, r) => acc + r.count, 0);
  const worst = rows[rows.length - 1];
  return `n=${total}, zwaarste bucket ~${worst.bucket_bps} bps (count=${worst.count})`;
}

function summarizeEventBuffer(kpis: EventBufferKpis | null | undefined): string {
  if (!kpis) return "geen event-buffer statistieken (n.v.t. of tabel leeg).";
  return `buffered=${kpis.buffered_count}, released=${kpis.released_count}, timed_out=${kpis.timed_out_count}, unknown=${kpis.unknown_state_count}`;
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
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>A. Run &amp; Data Health</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            {formatRunHealthPoint(execution.run_health_timeline?.[0] ?? null)}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            Export: {execution.exported_at ?? "onbekend"} · symbols_traded_24h:{" "}
            {execution.symbols_traded_24h != null ? execution.symbols_traded_24h : "—"}
          </p>
        </section>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>B. Epoch &amp; Ingest</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 0 }}>
            {execution.epoch_ingest_point
              ? `Epoch ${execution.epoch_ingest_point.epoch_id ?? "n.v.t."} · symbols_ok=${execution.epoch_ingest_point.symbols_ok ?? "?"}/${execution.epoch_ingest_point.symbols_expected ?? "?"} · valid=${
                  execution.epoch_ingest_point.is_valid === null ? "n.v.t." : execution.epoch_ingest_point.is_valid ? "ja" : "nee"
                }`
              : "Geen epoch/ingest-samenvatting in snapshot."}
          </p>
        </section>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>C. Execution (orders/fills)</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Orders 24h:{" "}
            <strong style={{ color: "var(--fg)" }}>{execution.orders_24h_count}</strong> · Fills 24h:{" "}
            <strong style={{ color: "var(--fg)" }}>{execution.fills_24h_count}</strong>
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            Orderstatus 24h: {summarizeLabelCounts(execution.orders_status_counts_24h)}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            Fills per side 24h: {summarizeLabelCounts(execution.fills_side_counts_24h)}
          </p>
        </section>
      )}

      {latency && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>D. Latency-profiel</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {latency.submit_to_ack_ms_avg != null
              ? `submit→ack gemiddeld ~${Math.round(latency.submit_to_ack_ms_avg)} ms (n=${latency.sample_count})`
              : `Geen submit→ack samples (n=${latency.sample_count})`}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: 0 }}>
            Histogram (submit→ack):{" "}
            {latency.submit_to_ack_histogram_ms_24h && latency.submit_to_ack_histogram_ms_24h.length > 0
              ? `${latency.submit_to_ack_histogram_ms_24h.length} buckets`
              : "geen histogram beschikbaar"}
          </p>
        </section>
      )}

      {pnl && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>E. PnL &amp; Positions</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Gerealiseerd PnL (24h, quote):{" "}
            {pnl.realized_pnl_quote_24h != null ? pnl.realized_pnl_quote_24h.toFixed(2) : "—"}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            Max drawdown (op basis van equity-trend, vertraagd):{" "}
            {pnl.drawdown_pct != null ? `${pnl.drawdown_pct.toFixed(2)} %` : "n.v.t."}
          </p>
          {pnl.exposure_summary && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
              Open posities: {pnl.exposure_summary.open_positions_count} (exit-only:{" "}
              {pnl.exposure_summary.exit_only_positions_count}, hard-blocked:{" "}
              {pnl.exposure_summary.hard_blocked_positions_count}); net exposure (base):{" "}
              {pnl.exposure_summary.net_base_position_s ?? "n.v.t."}
            </p>
          )}
        </section>
      )}

      {safety && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>F. Safety &amp; WS</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Normal:{" "}
            <strong style={{ color: "var(--fg)" }}>{safety.safety_normal_count}</strong> · Exit-only:{" "}
            {safety.safety_exit_only_count} · Hard-blocked: {safety.safety_hard_blocked_count}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            Symbolen per safety-mode:{" "}
            {safety.symbol_safety_active_modes && safety.symbol_safety_active_modes.length > 0
              ? `${safety.symbol_safety_active_modes.length} symbolen met expliciete modus`
              : "geen per-symbol safety-modes in snapshot."}
          </p>
        </section>
      )}

      <section className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>G. Market / pair summary</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 0 }}>
          Markt- en pairsamenvatting (spreads, suitability, L3-kwaliteit) blijft op het Tier 1 dashboard staan.
          Gebruik daarvoor de{" "}
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
            Data-pagina
          </Link>{" "}
          met de MarketSummary-module.
        </p>
      </section>

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>H. Shadow trades</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            Outcome-distributie: {summarizeLabelCounts(execution.shadow_outcome_counts)}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            Missed-move histogram: {summarizeMissedMoves(execution.shadow_missed_move_histogram)}
          </p>
        </section>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>I. Event buffer KPI</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            {summarizeEventBuffer(execution.event_buffer_kpis)}
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
