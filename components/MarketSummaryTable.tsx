"use client";

import { useState, useMemo } from "react";
import type { MarketPairRow } from "@/lib/snapshots";

interface MarketSummaryTableProps {
  pairs: MarketPairRow[];
}

type SortKey = "symbol" | "trade_count" | "avg_spread_bps" | "suitability_score";

function suitabilityColor(score: number | null): string {
  if (score == null) return "var(--muted)";
  if (score >= 0.7) return "var(--freshness-good)";
  if (score >= 0.4) return "var(--freshness-warn)";
  return "var(--freshness-stale)";
}

function tradeDensity(count: number): "Low" | "Med" | "High" {
  if (count >= 50) return "High";
  if (count >= 10) return "Med";
  return "Low";
}

export function MarketSummaryTable({ pairs }: MarketSummaryTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("symbol");
  const [desc, setDesc] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...pairs];
    arr.sort((a, b) => {
      let va: number | string = a[sortBy] ?? "";
      let vb: number | string = b[sortBy] ?? "";
      if (typeof va === "number" && typeof vb === "number") return desc ? vb - va : va - vb;
      return desc ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb));
    });
    return arr;
  }, [pairs, sortBy, desc]);

  const toggle = (key: SortKey) => {
    if (sortBy === key) setDesc((d) => !d);
    else {
      setSortBy(key);
      setDesc(key === "symbol" ? false : true);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
            <th>
              <button
                type="button"
                onClick={() => toggle("symbol")}
                style={{
                  padding: "0.5rem 0.75rem 0.5rem 0",
                  color: "var(--muted)",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "inherit",
                }}
              >
                Symbol {sortBy === "symbol" ? (desc ? "↓" : "↑") : ""}
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => toggle("trade_count")}
                style={{
                  padding: "0.5rem 0.75rem",
                  color: "var(--muted)",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "inherit",
                }}
              >
                Trades {sortBy === "trade_count" ? (desc ? "↓" : "↑") : ""}
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => toggle("avg_spread_bps")}
                style={{
                  padding: "0.5rem 0.75rem",
                  color: "var(--muted)",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "inherit",
                }}
              >
                Spread (bps) {sortBy === "avg_spread_bps" ? (desc ? "↓" : "↑") : ""}
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => toggle("suitability_score")}
                style={{
                  padding: "0.5rem 0 0.5rem 0.75rem",
                  color: "var(--muted)",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "inherit",
                }}
              >
                Suitability {sortBy === "suitability_score" ? (desc ? "↓" : "↑") : ""}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, 20).map((p) => {
            const spreadBps = p.avg_spread_bps ?? null;
            const spreadWarn = spreadBps != null && spreadBps > 20;
            const suit = p.suitability_score ?? null;
            const density = tradeDensity(p.trade_count);
            return (
              <tr key={p.symbol} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", fontFamily: "monospace" }}>
                  {p.symbol}
                </td>
                <td style={{ padding: "0.5rem 0.75rem" }}>
                  {p.trade_count}
                  <span
                    style={{
                      marginLeft: "0.35rem",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                    }}
                    title="Trade density"
                  >
                    ({density})
                  </span>
                </td>
                <td style={{ padding: "0.5rem 0.75rem" }}>
                  {spreadBps != null ? spreadBps.toFixed(1) : "—"}
                  {spreadWarn && (
                    <span
                      style={{
                        marginLeft: "0.35rem",
                        padding: "0.1rem 0.35rem",
                        borderRadius: 4,
                        background: "var(--freshness-warn)",
                        color: "#0f1419",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                      }}
                      title="Spread > 20 bps"
                    >
                      &gt;20
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: "0.5rem 0 0.5rem 0.75rem",
                    color: suit != null ? suitabilityColor(suit) : "var(--muted)",
                    fontWeight: suit != null ? 600 : 400,
                  }}
                >
                  {suit != null ? suit.toFixed(2) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
