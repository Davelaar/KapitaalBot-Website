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

const tableWrap: React.CSSProperties = {
  overflowX: "auto",
  marginTop: "0.5rem",
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
  if (orders.length === 0 && fills.length === 0) return null;

  return (
    <section style={{ marginTop: "2rem" }}>
      <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "1rem" }}>
        {t(locale, "dashboard.execution.delayNote")}
      </p>

      {orders.length > 0 && (
        <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
            {t(locale, "dashboard.execution.ordersTitle")}
          </h2>
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>{t(locale, "dashboard.execution.col.time")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.ref")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.symbol")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.side")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.type")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.status")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.qty")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.limit")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.regime")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.strategy")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((row, i) => (
                  <tr key={`o-${row.order_ref}-${i}`}>
                    <td style={td}>{row.ts_bucket}</td>
                    <td style={td}>
                      <code style={{ fontSize: "0.78em" }}>{row.order_ref}</code>
                    </td>
                    <td style={td}>{row.symbol}</td>
                    <td style={td}>{row.side}</td>
                    <td style={td}>{row.order_type}</td>
                    <td style={td}>{row.status}</td>
                    <td style={td}>{row.quantity_base}</td>
                    <td style={td}>{row.limit_price_quote ?? "—"}</td>
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
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
            {t(locale, "dashboard.execution.fillsTitle")}
          </h2>
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>{t(locale, "dashboard.execution.col.time")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.symbol")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.side")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.qty")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.price")}</th>
                  <th style={th}>{t(locale, "dashboard.execution.col.fee")}</th>
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
