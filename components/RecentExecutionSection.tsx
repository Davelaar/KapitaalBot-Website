"use client";

import type { CSSProperties } from "react";
import { useLocale } from "@/lib/locale";
import type { PublicTradingSnapshot } from "@/lib/snapshots";

export interface RecentExecutionSectionProps {
  trading: PublicTradingSnapshot | null;
  maxOrders?: number;
  maxFills?: number;
}

const tableWrap: CSSProperties = { overflowX: "auto", marginTop: "0.5rem" };
const th: CSSProperties = {
  textAlign: "left",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "var(--muted)",
  padding: "0.35rem 0.5rem",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};
const td: CSSProperties = {
  fontSize: "0.8125rem",
  padding: "0.4rem 0.5rem",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "top",
};

export default function RecentExecutionSection({
  trading,
  maxOrders = 10,
  maxFills = 10,
}: RecentExecutionSectionProps) {
  const locale = useLocale();
  const isNl = locale === "nl";
  if (!trading) return null;

  const orders = (trading.recent_orders ?? []).slice(0, maxOrders);
  const fills = (trading.recent_fills ?? []).slice(0, maxFills);
  const rejectReasons = trading.top_reject_reasons_last_hour ?? [];
  const routeWins = trading.route_wins_last_hour ?? [];
  const whyNoTrade = trading.why_no_trade_top_last_hour ?? [];

  if (
    orders.length === 0 &&
    fills.length === 0 &&
    rejectReasons.length === 0 &&
    routeWins.length === 0 &&
    whyNoTrade.length === 0
  ) {
    return null;
  }

  return (
    <section style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
      <div className="card" style={{ padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
          {isNl ? "Why-No-Trade en route-uitkomst (1h)" : "Why-No-Trade and route outcome (1h)"}
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong>{isNl ? "Reject reasons: " : "Reject reasons: "}</strong>
          {rejectReasons.length ? rejectReasons.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
        </p>
        <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong>{isNl ? "Why-No-Trade: " : "Why-No-Trade: "}</strong>
          {whyNoTrade.length ? whyNoTrade.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
        </p>
        <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong>{isNl ? "Route wins: " : "Route wins: "}</strong>
          {routeWins.length ? routeWins.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
        </p>
      </div>

      {orders.length > 0 && (
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
            {isNl ? "Recente execution context" : "Recent execution context"}
          </h2>
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    isNl ? "Tijd" : "Time",
                    "Ref",
                    isNl ? "Symbool" : "Symbol",
                    "Side",
                    isNl ? "Type" : "Type",
                    isNl ? "Status" : "Status",
                    isNl ? "Route" : "Route",
                    isNl ? "Regime" : "Regime",
                    isNl ? "Strategie" : "Strategy",
                  ].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((row, i) => (
                  <tr key={`o-${row.order_ref}-${i}`}>
                    <td style={td}>{row.ts_bucket}</td>
                    <td style={td}><code style={{ fontSize: "0.78em" }}>{row.order_ref}</code></td>
                    <td style={td}>{row.symbol}</td>
                    <td style={td}>{row.side}</td>
                    <td style={td}>{row.order_type}</td>
                    <td style={td}>{row.status}</td>
                    <td style={td}>{row.route_name ?? "—"}</td>
                    <td style={td}>{row.regime ?? "—"}</td>
                    <td style={td}>{row.strategy ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fills.length > 0 && (
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
            {isNl ? "Recente fill outcomes" : "Recent fill outcomes"}
          </h2>
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    isNl ? "Tijd" : "Time",
                    isNl ? "Symbool" : "Symbol",
                    "Side",
                    isNl ? "Qty" : "Qty",
                    isNl ? "Prijs" : "Price",
                    isNl ? "Fee" : "Fee",
                  ].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fills.map((row, i) => (
                  <tr key={`f-${row.ts_bucket}-${row.symbol}-${i}`}>
                    <td style={td}>{row.ts_bucket}</td>
                    <td style={td}>{row.symbol}</td>
                    <td style={td}>{row.side}</td>
                    <td style={td}>{row.fill_qty_base}</td>
                    <td style={td}>{row.fill_price_quote}</td>
                    <td style={td}>{row.fee_quote ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
