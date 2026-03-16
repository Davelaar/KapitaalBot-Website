"use client";

import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import type { PublicDemoTrades } from "@/lib/snapshots";

export interface DemoTradeTeaserProps {
  demo: PublicDemoTrades | null;
  maxItems?: number;
}

export default function DemoTradeTeaser({ demo, maxItems = 5 }: DemoTradeTeaserProps) {
  const locale = useLocale();

  if (!demo) {
    return (
      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          {t(locale, "demo.title")}
        </h2>
        <div
          className="card"
          style={{
            padding: "1.25rem",
            borderLeft: "4px solid var(--muted)",
          }}
        >
          <p style={{ margin: 0, color: "var(--muted)" }}>
            {t(locale, "metrics.awaiting")}
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--muted)" }}>
            {t(locale, "demo.noSnapshot")}
          </p>
        </div>
      </section>
    );
  }

  const items = demo.demo_trades?.slice(0, maxItems) ?? [];
  const hasItems = items.length > 0;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        {t(locale, "demo.title")}
      </h2>
      <div
        className="card"
        style={{
          padding: "1rem 1.25rem",
        }}
      >
        {hasItems ? (
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              lineHeight: 1.7,
            }}
          >
            {items.map((t, i) => (
              <li key={`${t.symbol}-${t.side}-${i}`}>
                <strong>{t.symbol}</strong> {t.side} — {t.lifecycle_summary}
                {t.outcome != null && (
                  <span style={{ color: "var(--muted)", marginLeft: "0.5rem" }}>
                    ({t.outcome}
                    {t.result_bps != null ? `, ${t.result_bps.toFixed(0)} bps` : ""})
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>{t(locale, "demo.empty")}</p>
        )}
      </div>
    </section>
  );
}
