"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { PublicTradingSnapshot, SlippageExampleRow } from "@/lib/snapshots";

type Props = {
  locale: Locale;
  trading: PublicTradingSnapshot | null;
};

function fmtBps(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${v >= 0 ? "" : ""}${v.toFixed(2)} bps`;
}

function fmtDur(secs: number | null | undefined): string {
  if (secs == null || !Number.isFinite(secs)) return "—";
  if (secs < 90) return `${Math.round(secs)}s`;
  if (secs < 3600) return `${Math.round(secs / 60)}m`;
  return `${(secs / 3600).toFixed(1)}h`;
}

function fmtPct01(x: number | null | undefined): string {
  if (x == null || !Number.isFinite(x)) return "—";
  return `${(x * 100).toFixed(1)}%`;
}

function SlippageBarPair({ locale, ex }: { locale: Locale; ex: SlippageExampleRow }) {
  const a = Math.abs(ex.expected_slippage_bps);
  const b = Math.abs(ex.realized_slippage_bps);
  const max = Math.max(a, b, 1e-6);
  const wExp = Math.min(100, (a / max) * 100);
  const wReal = Math.min(100, (b / max) * 100);
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <p style={{ margin: "0 0 0.2rem", fontSize: "0.78rem", color: "var(--muted)" }}>
        <strong>{ex.symbol}</strong> — Δ {fmtBps(ex.delta_bps)}
      </p>
      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: 2 }}>
        {t(locale, "dashboard.econ.slipExpected")}
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: "var(--surface-strong)",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: `${wExp}%`,
            height: "100%",
            borderRadius: 4,
            background: "var(--info)",
            minWidth: wExp > 0 ? 4 : 0,
          }}
        />
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: 2 }}>
        {t(locale, "dashboard.econ.slipRealized")}
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "var(--surface-strong)" }}>
        <div
          style={{
            width: `${wReal}%`,
            height: "100%",
            borderRadius: 4,
            background: "var(--brand)",
            minWidth: wReal > 0 ? 4 : 0,
          }}
        />
      </div>
    </div>
  );
}

export function ExecutionEconomicsStrip({ locale, trading }: Props) {
  const slip = trading?.slippage_variance_24h;
  const hold = trading?.hold_time_vs_horizon_24h;
  const fee = trading?.fee_impact_24h;
  const ex0 = slip?.notable_examples?.[0];

  const slipLabels = (key: "expected" | "realized") =>
    t(locale, key === "expected" ? "dashboard.econ.slipExpectedShort" : "dashboard.econ.slipRealizedShort");

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
        minWidth: 0,
      }}
    >
      <section className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>{t(locale, "dashboard.econ.slippageTitle")}</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.82rem" }}>{t(locale, "dashboard.econ.slippageIntro")}</p>
        <p style={{ margin: "0.35rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.sampleN")}</strong> {slip?.sample_n ?? 0}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.meanDelta")}</strong> {fmtBps(slip?.mean_delta_bps ?? undefined)}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.medianDelta")}</strong> {fmtBps(slip?.median_delta_bps ?? undefined)}
        </p>
        {ex0 ? (
          <div>
            <p style={{ margin: "0.65rem 0 0", fontSize: "0.82rem", fontWeight: 600 }}>{t(locale, "dashboard.econ.worstExample")}</p>
            <p style={{ margin: "0.2rem 0 0.15rem", fontSize: "0.72rem", color: "var(--muted)" }}>
              {slipLabels("expected")} {fmtBps(ex0.expected_slippage_bps)} · {slipLabels("realized")}{" "}
              {fmtBps(ex0.realized_slippage_bps)}
            </p>
            <SlippageBarPair locale={locale} ex={ex0} />
          </div>
        ) : (
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>{t(locale, "dashboard.econ.slippageEmpty")}</p>
        )}
      </section>

      <section className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>{t(locale, "dashboard.econ.holdTitle")}</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.82rem" }}>{t(locale, "dashboard.econ.holdIntro")}</p>
        <p style={{ margin: "0.35rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.closedN")}</strong> {hold?.closed_positions_n ?? 0}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.medianHold")}</strong> {fmtDur(hold?.median_hold_secs ?? undefined)}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.p90Hold")}</strong> {fmtDur(hold?.p90_hold_secs ?? undefined)}
        </p>
        <p style={{ margin: "0.45rem 0 0.15rem", fontSize: "0.82rem", fontWeight: 600 }}>{t(locale, "dashboard.econ.holdBenchmarks")}</p>
        <ul style={{ margin: "0.2rem 0 0", paddingLeft: "1.1rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          <li>
            &gt; 1m: {fmtPct01(hold?.pct_hold_over_1m ?? undefined)}
          </li>
          <li>
            &gt; 3m: {fmtPct01(hold?.pct_hold_over_3m ?? undefined)}
          </li>
          <li>
            &gt; 15m: {fmtPct01(hold?.pct_hold_over_15m ?? undefined)}
          </li>
        </ul>
      </section>

      <section className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>{t(locale, "dashboard.econ.feeTitle")}</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.82rem" }}>{t(locale, "dashboard.econ.feeIntro")}</p>
        <p style={{ margin: "0.35rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.feesPaid")}</strong> {fee != null ? fee.fees_paid_quote.toFixed(2) : "—"}{" "}
          <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>(quote)</span>
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.pnlNet24h")}</strong> {fee != null ? fee.realized_pnl_net_quote.toFixed(2) : "—"}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.88rem" }}>
          <strong>{t(locale, "dashboard.econ.feeRatio")}</strong>{" "}
          {fee?.fee_to_abs_net_pnl_ratio != null ? `${(fee.fee_to_abs_net_pnl_ratio * 100).toFixed(1)}%` : "—"}{" "}
          <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{t(locale, "dashboard.econ.feeRatioHint")}</span>
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.82rem", color: "var(--muted)" }}>
          {t(locale, "dashboard.econ.fillsWithFee")} {fee?.fills_with_fee_count ?? "—"}
        </p>
      </section>
    </div>
  );
}
