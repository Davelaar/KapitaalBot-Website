"use client";

import { useState } from "react";
import type {
  PublicMarketSnapshot,
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
} from "@/lib/snapshots";

interface AdminSnapshotStatusProps {
  status: PublicStatusSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
  trading: PublicTradingSnapshot | null;
  market: PublicMarketSnapshot | null;
}

export function AdminSnapshotStatus({
  status,
  regime,
  strategy,
  trading,
  market,
}: AdminSnapshotStatusProps) {
  const [showRaw, setShowRaw] = useState(false);

  const payload = { status, regime, strategy, trading, market };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Snapshot-status</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, fontSize: "0.9rem", color: "var(--muted)" }}>
          <li><strong style={{ color: "var(--fg)" }}>Status</strong>: {status ? status.exported_at : "—"} · run_id {status?.run_id ?? "—"} · epoch {status?.epoch_status ?? "—"}</li>
          <li><strong style={{ color: "var(--fg)" }}>Regime</strong>: {regime ? regime.exported_at : "—"}</li>
          <li><strong style={{ color: "var(--fg)" }}>Strategy</strong>: {strategy ? strategy.exported_at : "—"}</li>
          <li><strong style={{ color: "var(--fg)" }}>Trading</strong>: {trading ? trading.exported_at : "—"}</li>
          <li><strong style={{ color: "var(--fg)" }}>Market</strong>: {market ? market.exported_at : "—"}</li>
        </ul>
        <p style={{ marginTop: "0.75rem", marginBottom: 0, fontSize: "0.875rem", color: "var(--muted)" }}>
          Safety: N={status?.safety_normal_count ?? "—"} E={status?.safety_exit_only_count ?? "—"} B={status?.safety_hard_blocked_count ?? "—"}
        </p>
      </div>

      <div className="card">
        <button
          type="button"
          onClick={() => setShowRaw((r) => !r)}
          style={{
            padding: "0.35rem 0.75rem",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--card-bg)",
            color: "var(--fg)",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          {showRaw ? "Verberg raw JSON" : "Toon raw JSON"}
        </button>
        {showRaw && (
          <pre
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: "0.75rem",
              overflow: "auto",
              maxHeight: "60vh",
            }}
          >
            {JSON.stringify(payload, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
