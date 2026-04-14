"use client";

import type { CSSProperties } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import type { PublicTradingSnapshot } from "@/lib/snapshots";

export interface RecentExecutionSectionProps {
  trading: PublicTradingSnapshot | null;
  maxOrders?: number;
  maxFills?: number;
}

const tableWrap: CSSProperties = {
  overflowX: "auto",
  marginTop: "0.5rem",
  maxWidth: "100%",
  minWidth: 0,
  WebkitOverflowScrolling: "touch",
};
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
    <section style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", minWidth: 0 }}>
      <div className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
          {t(locale, "dashboard.exec.wntTitle")}
        </h2>
        <p className="kb-dash-prose" style={{ margin: 0, color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong>{t(locale, "dashboard.exec.rejectReasons")}</strong>
          {rejectReasons.length ? rejectReasons.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
        </p>
        <p className="kb-dash-prose" style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong>Why-No-Trade: </strong>
          {whyNoTrade.length ? whyNoTrade.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
        </p>
        <p className="kb-dash-prose" style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong>{t(locale, "dashboard.exec.routeWins")}</strong>
          {routeWins.length ? routeWins.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
        </p>
      </div>

      {orders.length > 0 && (
        <div className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
            {t(locale, "dashboard.exec.recentContext")}
          </h2>
          <div className="kb-table-scroll" style={tableWrap}>
            <table className="kb-table">
              <thead>
                <tr>
                  {[
                    t(locale, "dashboard.execution.col.time"),
                    "Ref",
                    t(locale, "dashboard.execution.col.symbol"),
                    "Side",
                    t(locale, "dashboard.execution.col.type"),
                    t(locale, "dashboard.execution.col.status"),
                    "Route",
                    t(locale, "dashboard.execution.col.regime"),
                    t(locale, "dashboard.execution.col.strategy"),
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
        <div className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
            {t(locale, "dashboard.exec.recentFills")}
          </h2>
          <div className="kb-table-scroll" style={tableWrap}>
            <table className="kb-table">
              <thead>
                <tr>
                  {[
                    t(locale, "dashboard.execution.col.time"),
                    t(locale, "dashboard.execution.col.symbol"),
                    "Side",
                    t(locale, "dashboard.execution.col.qty"),
                    t(locale, "dashboard.execution.col.price"),
                    t(locale, "dashboard.execution.col.fee"),
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
