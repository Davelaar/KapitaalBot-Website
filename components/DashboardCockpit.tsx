"use client";

import type { Locale } from "@/lib/i18n";
import type {
  EquityPoint,
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
  Tier2DataBundle,
  Tier2EdgeboardSignalRow,
} from "@/lib/snapshots";
import { cockpitT } from "@/lib/dashboard-cockpit-i18n";
import { formatDelaySeconds } from "@/lib/snapshot-freshness";
import { InstrumentGauge } from "@/components/InstrumentGauge";
import type { PieSegment } from "@/components/SimplePieChart";
import { SimplePieChart } from "@/components/SimplePieChart";
import { CockpitKrakenMark } from "@/components/CockpitKrakenMark";

function formatFreshnessMs(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 120) return `${secs}s`;
  return `${Math.round(secs / 60)}m`;
}

function pnlSegments(trading: PublicTradingSnapshot | null, locale: Locale): PieSegment[] {
  const w = trading?.symbol_pnl_day_utc_top_winners ?? [];
  const l = trading?.symbol_pnl_day_utc_top_losers ?? [];
  const winSum = w.reduce((a, x) => a + Math.max(0, x.realized_pnl_quote), 0);
  const lossSum = Math.abs(l.reduce((a, x) => a + Math.min(0, x.realized_pnl_quote), 0));
  const out: PieSegment[] = [];
  if (winSum > 0) out.push({ label: cockpitT(locale, "pnlWinners"), value: winSum, color: "var(--brand)" });
  if (lossSum > 0) out.push({ label: cockpitT(locale, "pnlLosers"), value: lossSum, color: "var(--danger)" });
  return out;
}

function edgeBadge(s: Tier2EdgeboardSignalRow): "allow" | "skip" | "halt" {
  if (s.expected_net_edge_bps < 0) return "halt";
  if (s.confidence < 0.28) return "skip";
  return "allow";
}

function MiniBars({
  equity,
  fallbackHeights,
  ariaLabel,
}: {
  equity: EquityPoint[] | null | undefined;
  fallbackHeights: number[];
  ariaLabel: string;
}) {
  const pts = equity?.length ? equity.slice(-16) : null;
  let heights: number[] = [];
  if (pts && pts.length > 1) {
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    heights = vals.map((v) => 5 + ((v - min) / range) * 26);
  } else {
    heights = fallbackHeights.slice(0, 12);
  }
  return (
    <div className="cockpit-mini-bars" role="img" aria-label={ariaLabel}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="cockpit-mini-bar"
          style={{
            height: `${h}px`,
            opacity: 0.35 + Math.min(0.55, (h / 32) * 0.55),
          }}
        />
      ))}
    </div>
  );
}

export function DashboardCockpit({
  locale,
  status,
  regime,
  strategy,
  trading,
  dataBundle,
}: {
  locale: Locale;
  status: PublicStatusSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
  trading: PublicTradingSnapshot | null;
  dataBundle: Tier2DataBundle | null;
}) {
  const delaySecs = status?.data_freshness_secs ?? null;
  const blocked = status?.safety_hard_blocked_count ?? 0;
  const exitOnly = status?.safety_exit_only_count ?? 0;
  const normal = status?.safety_normal_count ?? 0;

  const orders24 = trading?.orders_24h_count ?? 0;
  const trades24 = trading?.trades_24h_count ?? 0;
  const fillPct = orders24 > 0 ? Math.min(100, Math.round((trades24 / orders24) * 100)) : trades24 > 0 ? 100 : 0;

  const symCount = status?.epoch_symbol_count ?? null;
  const l3Sym = status?.l3_symbol_count ?? null;
  const l3Pct =
    symCount != null && symCount > 0 && l3Sym != null && l3Sym >= 0 ? Math.round((l3Sym / symCount) * 100) : null;

  const freshSecs = status?.data_freshness_secs ?? null;
  const feedGaugePct =
    freshSecs == null ? 55 : freshSecs <= 60 ? 100 : Math.max(12, 100 - Math.min(95, freshSecs));

  const dominantRegime = regime?.dominant_regime ?? (regime?.active_regimes?.[0]?.regime ?? "—");
  const stratN = strategy?.strategy_count ?? strategy?.active_strategies?.length ?? 0;

  const pnlS = pnlSegments(trading, locale);
  const pnlTotalAbs = pnlS.length > 0 ? pnlS.reduce((a, x) => a + x.value, 0) : undefined;

  const edgeRows = (dataBundle?.edgeboard?.top_signals ?? []).slice(0, 10);

  const tickerN = status?.ticker_count ?? 0;
  const tradeN = status?.trade_count ?? 0;
  const l2n = status?.l2_count ?? 0;
  const l3n = status?.l3_count ?? 0;
  const maxT = Math.max(tickerN, tradeN, l2n, l3n, 1);
  const fallbackBars = [tickerN, tradeN, l2n, l3n, tickerN * 0.3, tradeN * 0.5, l2n * 0.4, l3n * 0.8].map((v) =>
    Math.max(4, Math.min(28, 4 + (v / maxT) * 24)),
  );

  const flowCenter =
    orders24 === 0 && trades24 === 0 ? cockpitT(locale, "gaugeFlowEmpty") : `${fillPct}%`;
  const ordersGaugePct = Math.min(100, Math.round((orders24 / Math.max(orders24, 120)) * 100));
  const ordersCenter = String(orders24);
  const feedCenter = freshSecs != null ? `${freshSecs}s` : "—";

  const allowActive = blocked === 0;
  const haltActive = blocked > 0;

  return (
    <div className="cockpit-root">
      <header className="cockpit-hero">
        <div className="cockpit-hero__row">
          <div className="cockpit-hero__titles">
            <h1 className="cockpit-brand">KapitaalBot</h1>
            <p className="cockpit-tagline">{cockpitT(locale, "tagline")}</p>
            {delaySecs != null && (
              <p className="cockpit-delay">
                {cockpitT(locale, "delay")}: <span className="cockpit-delay__mono">~{formatDelaySeconds(delaySecs)}</span>
              </p>
            )}
          </div>
          <CockpitKrakenMark ariaLabel={cockpitT(locale, "krakenMarkAria")} locale={locale} />
        </div>
      </header>

      <div className="cockpit-col-left">
          <section className="cockpit-panel">
            <h2 className="cockpit-panel__title">{cockpitT(locale, "runtime")}</h2>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span className="cockpit-dot cockpit-dot--cyan" aria-hidden />
                {cockpitT(locale, "exchange")}
              </span>
              <span className="cockpit-runtime-value">Kraken</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span className="cockpit-dot cockpit-dot--cyan" aria-hidden />
                {cockpitT(locale, "run")}
              </span>
              <span className="cockpit-runtime-value mono">#{status?.run_id ?? "—"}</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span
                  className={`cockpit-dot ${status?.epoch_status === "valid" ? "cockpit-dot--green" : "cockpit-dot--amber"}`}
                  aria-hidden
                />
                {cockpitT(locale, "epoch")}
              </span>
              <span className="cockpit-runtime-value mono">{status?.epoch_status ?? "—"}</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span
                  className={`cockpit-dot ${freshSecs != null && freshSecs <= 60 ? "cockpit-dot--green" : "cockpit-dot--amber"}`}
                  aria-hidden
                />
                {cockpitT(locale, "feed")}
              </span>
              <span className="cockpit-runtime-value mono">{freshSecs != null ? `${freshSecs}s` : "—"}</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span className="cockpit-dot cockpit-dot--cyan" aria-hidden />
                {cockpitT(locale, "symbols")}
              </span>
              <span className="cockpit-runtime-value mono">{symCount ?? "—"}</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span className="cockpit-dot cockpit-dot--cyan" aria-hidden />
                {cockpitT(locale, "regime")}
              </span>
              <span className="cockpit-runtime-value">{dominantRegime}</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span className="cockpit-dot cockpit-dot--cyan" aria-hidden />
                {cockpitT(locale, "strategy")}
              </span>
              <span className="cockpit-runtime-value mono">{stratN}</span>
            </div>
            <div className="cockpit-runtime-row">
              <span className="cockpit-runtime-label">
                <span className={`cockpit-dot ${blocked > 0 ? "cockpit-dot--red" : exitOnly > 0 ? "cockpit-dot--amber" : "cockpit-dot--green"}`} aria-hidden />
                {cockpitT(locale, "safety")}
              </span>
              <span className="cockpit-runtime-value mono">
                N={normal} · E={exitOnly} · B={blocked}
              </span>
            </div>
          </section>

          <section className="cockpit-panel cockpit-panel--accent-top">
            <div className="cockpit-overview-split">
              <div className="cockpit-pnl-block">
                <h2 className="cockpit-panel__title cockpit-panel__title--inline">{cockpitT(locale, "pnlTitle")}</h2>
                {pnlS.length > 0 ? (
                  <SimplePieChart
                    title=""
                    segments={pnlS}
                    size={132}
                    variant="donut"
                    locale={locale}
                    centerValue={pnlTotalAbs}
                    showLegend={false}
                    className="cockpit-pnl-chart"
                  />
                ) : (
                  <p className="cockpit-pnl-empty">{cockpitT(locale, "pnlEmpty")}</p>
                )}
              </div>
              <ul className="cockpit-metric-list">
                <li>
                  <span className="cockpit-metric-list__k">{cockpitT(locale, "metricL3")}</span>
                  <span className="cockpit-metric-list__v brand">{l3Pct != null ? `${l3Pct}%` : "—"}</span>
                </li>
                <li>
                  <span className="cockpit-metric-list__k">{cockpitT(locale, "metricOrders24h")}</span>
                  <span className="cockpit-metric-list__v">{orders24}</span>
                </li>
                <li>
                  <span className="cockpit-metric-list__k">{cockpitT(locale, "metricTrades24h")}</span>
                  <span className="cockpit-metric-list__v">{trades24}</span>
                </li>
                <li>
                  <span className="cockpit-metric-list__k">{cockpitT(locale, "metricDD")}</span>
                  <span className="cockpit-metric-list__v">{trading?.drawdown_pct != null ? `${trading.drawdown_pct.toFixed(1)}%` : "—"}</span>
                </li>
              </ul>
            </div>
            <p className="cockpit-bars-label">{cockpitT(locale, "barsCaption")}</p>
            <MiniBars
              equity={trading?.equity_trend_delayed}
              fallbackHeights={fallbackBars}
              ariaLabel={cockpitT(locale, "barsAria")}
            />
            <p className="cockpit-bars-hint">{cockpitT(locale, "barsHint")}</p>
          </section>
      </div>

      <div className="cockpit-col-right">
          <section className="cockpit-panel cockpit-panel--tight">
            <div className="cockpit-gauges-row">
              <InstrumentGauge
                pct={orders24 === 0 && trades24 === 0 ? 8 : fillPct}
                centerPrimary={flowCenter}
                footnote={cockpitT(locale, "gaugeFlow")}
                size={108}
                stroke={10}
              />
              <InstrumentGauge
                pct={ordersGaugePct}
                centerPrimary={ordersCenter}
                footnote={cockpitT(locale, "gaugeOrders")}
                size={108}
                stroke={10}
              />
              <InstrumentGauge
                pct={feedGaugePct}
                centerPrimary={feedCenter}
                footnote={cockpitT(locale, "gaugeFeeds")}
                size={108}
                stroke={10}
              />
            </div>
            <div className="cockpit-cta-row">
              <span className={`cockpit-cta cockpit-cta--allow${allowActive ? " is-active" : ""}`}>{cockpitT(locale, "btnAllow")}</span>
              <span className={`cockpit-cta cockpit-cta--halt${haltActive ? " is-active" : ""}`}>{cockpitT(locale, "btnHalt")}</span>
            </div>
            <p className="cockpit-cta-hint mono">
              {blocked > 0
                ? cockpitT(locale, "cardIntentBlocked")
                : exitOnly > 0
                  ? cockpitT(locale, "cardIntentGuard")
                  : cockpitT(locale, "cardIntentEntry")}
            </p>
          </section>
          <div className="cockpit-state-cards">
            <section className={`cockpit-state-card cockpit-state-card--allow${allowActive && !haltActive ? " is-lit" : ""}`}>
              <div className="cockpit-state-card__head">
                <span className="cockpit-state-card__icon" aria-hidden>
                  ◎
                </span>
                <h3>{cockpitT(locale, "cardAllow")}</h3>
              </div>
              <p className="cockpit-state-card__line">{cockpitT(locale, "cardExchange")}</p>
              <p className="cockpit-state-card__line muted small">{cockpitT(locale, "cardIntentEntry")}</p>
              <span className="cockpit-state-card__conf">{cockpitT(locale, "cardConf")}</span>
            </section>
            <section className={`cockpit-state-card cockpit-state-card--halt${haltActive ? " is-lit" : ""}`}>
              <div className="cockpit-state-card__head">
                <span className="cockpit-state-card__icon cockpit-state-card__icon--halt" aria-hidden>
                  ◎
                </span>
                <h3>{cockpitT(locale, "cardHalt")}</h3>
              </div>
              <p className="cockpit-state-card__line">{cockpitT(locale, "cardExchange")}</p>
              <p className="cockpit-state-card__line muted small">{cockpitT(locale, "cardIntentBlocked")}</p>
              <span className="cockpit-state-card__conf">{cockpitT(locale, "cardConf")}</span>
            </section>
          </div>
      </div>

      <div className="cockpit-bottom-left">
        <section className="cockpit-panel cockpit-panel--table">
          <h2 className="cockpit-panel__title">{cockpitT(locale, "tableTitle")}</h2>
          {edgeRows.length === 0 ? (
            <p className="cockpit-muted">{cockpitT(locale, "noRows")}</p>
          ) : (
            <div className="cockpit-table-scroll">
              <table className="cockpit-dense-table">
                <thead>
                  <tr>
                    <th>{cockpitT(locale, "colAction")}</th>
                    <th>{cockpitT(locale, "colExecution")}</th>
                    <th>{cockpitT(locale, "colReason")}</th>
                    <th>{cockpitT(locale, "colSignal")}</th>
                    <th>{cockpitT(locale, "colStatus")}</th>
                  </tr>
                </thead>
                <tbody>
                  {edgeRows.map((s, i) => {
                    const b = edgeBadge(s);
                    return (
                      <tr key={`${s.symbol}-${i}`}>
                        <td>
                          <span className={`cockpit-badge cockpit-badge--${b}`}>
                            {b === "allow" ? cockpitT(locale, "badgeAllow") : b === "skip" ? cockpitT(locale, "badgeSkip") : cockpitT(locale, "badgeHalt")}
                          </span>
                        </td>
                        <td className="mono">{s.symbol}</td>
                        <td className="cockpit-td-clip">{s.dominant_reason_code ?? s.route_name}</td>
                        <td className="mono">{s.route_name}</td>
                        <td className="mono muted">{formatFreshnessMs(s.freshness_ms)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
