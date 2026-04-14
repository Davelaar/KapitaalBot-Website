"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { ReactNode } from "react";
import Link from "next/link";
import { withLocale } from "@/lib/locale-path";
import type {
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
  Tier2DataBundle,
} from "@/lib/snapshots";
import { LabelCountBarTable } from "@/components/LabelCountBarTable";
import { labelCountsToPieSegments, pieSegmentsTotal, SimplePieChart } from "@/components/SimplePieChart";
import { ExecutionEconomicsStrip } from "@/components/ExecutionEconomicsStrip";

type Props = {
  locale: Locale;
  status: PublicStatusSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
  trading: PublicTradingSnapshot | null;
  dataBundle: Tier2DataBundle | null;
};

function formatHorizonSec(sec: number | null | undefined): string {
  if (sec == null || sec <= 0) return "—";
  return String(sec);
}

function formatFreshnessMs(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 120) return `${secs}s`;
  return `${Math.round(secs / 60)}m`;
}

function freshnessClass(ms: number | null | undefined): string {
  if (ms == null) return "kb-fresh-muted";
  if (ms <= 300_000) return "kb-fresh-ok";
  if (ms <= 3_600_000) return "kb-fresh-warn";
  return "kb-fresh-bad";
}

const FEED_FRESHNESS_STALE_THRESHOLD_SECS = 60;

function card(title: string, body: ReactNode) {
  return (
    <section className="card" style={{ padding: "1rem 1.25rem", minWidth: 0 }}>
      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
      {body}
    </section>
  );
}

export function RouteCentricDashboard({ locale, status, regime, strategy, trading, dataBundle }: Props) {
  const pieOther = t(locale, "dashboard.pieOther");

  const rejectReasons1h = trading?.top_reject_reasons_last_hour ?? [];
  const pathTapeRows = dataBundle?.path_doctrine?.orders_by_path_tape_24h ?? [];
  const edgeSignals = dataBundle?.edgeboard?.top_signals ?? [];
  const edgeboardSourceDb = dataBundle?.edgeboard?.source_db ?? null;
  const edgeboardSnapshotAgeMs = dataBundle?.edgeboard?.snapshot_age_ms ?? null;
  const isDecisionFallback = edgeboardSourceDb === "decision_fallback";
  const feedFreshnessSecs = status?.data_freshness_secs ?? null;
  const feedStale = feedFreshnessSecs != null && feedFreshnessSecs > FEED_FRESHNESS_STALE_THRESHOLD_SECS;
  const activeRegimes = regime?.active_regimes ?? [];
  const activeStrategies = strategy?.active_strategies ?? [];

  const regimePie = labelCountsToPieSegments(
    activeRegimes.map((r) => ({ label: r.regime, count: r.count })),
    8,
    pieOther,
  );
  const strategyPie = labelCountsToPieSegments(
    activeStrategies.map((s) => ({ label: s.strategy, count: s.count })),
    8,
    pieOther,
  );
  const funnelStagePie = labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_stage_counts_24h, 8, pieOther);
  const decisionPie = labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_decision_code_counts_24h, 8, pieOther);
  const pathTapePie = labelCountsToPieSegments(dataBundle?.path_doctrine?.orders_by_path_tape_24h, 8, pieOther);

  const winners = trading?.symbol_pnl_day_utc_top_winners ?? [];
  const losers = trading?.symbol_pnl_day_utc_top_losers ?? [];
  const pnlDayEmpty = winners.length === 0 && losers.length === 0;

  const edgeCandidates = dataBundle?.edgeboard?.candidates ?? [];
  const edgeSortedDesc = [...edgeCandidates].sort(
    (a, b) => b.best_expected_net_edge_bps - a.best_expected_net_edge_bps,
  );
  const edgeBest3 = edgeSortedDesc.slice(0, 3);
  const edgeWorst3 = [...edgeCandidates]
    .sort((a, b) => a.best_expected_net_edge_bps - b.best_expected_net_edge_bps)
    .slice(0, 3);

  return (
    <div className="route-centric-dashboard" style={{ display: "grid", gap: "1rem", minWidth: 0 }}>
      {card(
        t(locale, "dashboard.rcd.liveRouteBoard"),
        <>
          <p className="kb-dash-prose" style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            {t(locale, "dashboard.routeBoardIntro")}
          </p>
          <p className="kb-refresh-note kb-dash-prose">{t(locale, "dashboard.refreshNote")}</p>
          {isDecisionFallback && (
            <p className="kb-callout-warn">
              {t(locale, "dashboard.edgeboard.decisionFallbackWarn")}
            </p>
          )}
          {edgeboardSnapshotAgeMs != null && (
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "var(--muted)" }}>
              {t(locale, "dashboard.rcd.snapshotAge")}{formatFreshnessMs(edgeboardSnapshotAgeMs)}
              {edgeboardSourceDb ? ` · ${t(locale, "dashboard.rcd.source")}: ${edgeboardSourceDb}` : ""}
            </p>
          )}
          {edgeSignals.length > 0 ? (
            <div
              className="kb-table-scroll"
              style={{
                maxHeight: "min(70vh, 28rem)",
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            >
              <table className="kb-table">
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    {["#", "Symbol", "Route", t(locale, "dashboard.routeColHorizon"), "Net Edge (bps)", "Confidence", "Reason", "Fresh"].map((h) => (
                      <th key={h} style={{ textAlign: "left" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {edgeSignals.map((s, idx) => (
                    <tr key={`${idx}-${s.symbol}-${s.rank}-${s.route_name}-${s.horizon_sec}`}>
                      <td>{s.rank}</td>
                      <td>{s.symbol}</td>
                      <td>{s.route_name}</td>
                      <td>{formatHorizonSec(s.horizon_sec)}</td>
                      <td className={s.expected_net_edge_bps < 0 ? "kb-num-neg" : undefined}>{s.expected_net_edge_bps.toFixed(1)}</td>
                      <td>{s.confidence.toFixed(2)}</td>
                      <td>{s.dominant_reason_code ?? "—"}</td>
                      <td className={freshnessClass(s.freshness_ms)}>{formatFreshnessMs(s.freshness_ms)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>
              {t(locale, "dashboard.rcd.noSignals")}
            </p>
          )}
          <p className="kb-dash-prose" style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "var(--muted)" }}>
            {t(locale, "dashboard.routeBoardMeta")}
          </p>
        </>,
      )}

      {edgeCandidates.length > 0
        ? card(
            t(locale, "dashboard.edgeCandidatesTitle"),
            <>
              <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>{t(locale, "dashboard.edgeCandidatesIntro")}</p>
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
                  minWidth: 0,
                }}
              >
                <div>
                  <p className="kb-section-title-ok">{t(locale, "dashboard.edgeCandidatesBest")}</p>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
                    {edgeBest3.map((c) => (
                      <li key={`b-${c.symbol}`}>
                        <strong>{c.symbol}</strong> · {c.best_expected_net_edge_bps.toFixed(1)} bps · conf {c.best_confidence.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kb-section-title-bad">{t(locale, "dashboard.edgeCandidatesWorst")}</p>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
                    {edgeWorst3.map((c) => (
                      <li key={`w-${c.symbol}`}>
                        <strong>{c.symbol}</strong> · {c.best_expected_net_edge_bps.toFixed(1)} bps · conf {c.best_confidence.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>,
          )
        : null}

      <ExecutionEconomicsStrip locale={locale} trading={trading} />

      {card(t(locale, "dashboard.dailyPnlTitle"), (
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>{t(locale, "dashboard.dailyPnlUtcNote")}</p>
          {pnlDayEmpty ? (
            <p style={{ margin: "0 0 0.75rem", color: "var(--muted)", fontSize: "0.82rem" }}>{t(locale, "dashboard.dailyPnlEmpty")}</p>
          ) : null}
          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
              minWidth: 0,
            }}
          >
            <div>
              <p className="kb-section-title-ok">{t(locale, "dashboard.topWinners")}</p>
              {winners.length ? (
                <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
                  {winners.map((w) => (
                    <li key={w.symbol}>
                      <strong>{w.symbol}</strong> · +{w.realized_pnl_quote.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>—</p>
              )}
            </div>
            <div>
              <p className="kb-section-title-bad">{t(locale, "dashboard.topLosers")}</p>
              {losers.length ? (
                <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
                  {losers.map((w) => (
                    <li key={w.symbol}>
                      <strong>{w.symbol}</strong> · {w.realized_pnl_quote.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>—</p>
              )}
            </div>
          </div>
        </>
      ))}

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
          minWidth: 0,
        }}
      >
        <section className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{t(locale, "dashboard.rcd.funnelTitle")}</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem 1.25rem",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <SimplePieChart
              title={t(locale, "dashboard.rcd.funnelStage24h")}
              segments={funnelStagePie}
              size={158}
              variant="donut"
              locale={locale}
              centerValue={pieSegmentsTotal(funnelStagePie) > 0 ? pieSegmentsTotal(funnelStagePie) : undefined}
            />
            <SimplePieChart
              title={t(locale, "dashboard.rcd.decisionCodes24h")}
              segments={decisionPie}
              size={158}
              variant="donut"
              locale={locale}
              centerValue={pieSegmentsTotal(decisionPie) > 0 ? pieSegmentsTotal(decisionPie) : undefined}
            />
          </div>
        </section>
        <section className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{t(locale, "dashboard.rcd.regimeStrategy")}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "flex-start" }}>
            <SimplePieChart
              title={t(locale, "dashboard.rcd.activeRegimes")}
              segments={regimePie}
              size={158}
              variant="donut"
              locale={locale}
              centerValue={pieSegmentsTotal(regimePie) > 0 ? pieSegmentsTotal(regimePie) : undefined}
            />
            <SimplePieChart
              title={t(locale, "dashboard.rcd.activeStrategies")}
              segments={strategyPie}
              size={158}
              variant="donut"
              locale={locale}
              centerValue={pieSegmentsTotal(strategyPie) > 0 ? pieSegmentsTotal(strategyPie) : undefined}
            />
          </div>
        </section>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
          minWidth: 0,
        }}
      >
        {card(
          t(locale, "dashboard.rcd.wntTitle"),
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {t(locale, "dashboard.rcd.wntIntro")}
            </p>
            <div className="kb-tier2-wnt-grids" style={{ marginTop: "0.5rem" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.rcd.rejectReasons1h")}
                </p>
                <LabelCountBarTable
                  rows={rejectReasons1h}
                  emptyLabel="—"
                  maxRows={10}
                  accentColor="var(--pie-5)"
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.rcd.funnelStageLabel")}
                </p>
                <LabelCountBarTable rows={dataBundle?.route_no_trade?.funnel_stage_counts_24h} emptyLabel="—" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.rcd.decisionCodesLabel")}
                </p>
                <LabelCountBarTable rows={dataBundle?.route_no_trade?.funnel_decision_code_counts_24h} emptyLabel="—" maxRows={12} />
              </div>
            </div>
          </>,
        )}

        {card(
          t(locale, "dashboard.rcd.positionContext"),
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {t(locale, "dashboard.posContext.intro")}
            </p>
            <SimplePieChart
              title={t(locale, "dashboard.rcd.ordersByPath")}
              segments={pathTapePie}
              size={152}
              variant="donut"
              locale={locale}
              centerValue={pieSegmentsTotal(pathTapePie) > 0 ? pieSegmentsTotal(pathTapePie) : undefined}
            />
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
              <strong style={{ marginRight: "0.25rem" }}>Safety:</strong>
              <span className="kb-state-allow" title={t(locale, "dashboard.rcd.safetyNormal")}>
                N={status?.safety_normal_count ?? "—"}
              </span>
              <span className="kb-state-skip" title={t(locale, "dashboard.rcd.safetyExit")}>
                E={status?.safety_exit_only_count ?? "—"}
              </span>
              <span className="kb-state-halt" title={t(locale, "dashboard.rcd.safetyBlock")}>
                B={status?.safety_hard_blocked_count ?? "—"}
              </span>
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--text)" }}>
              {t(locale, "dashboard.rcd.pathTapeLabel")}
            </p>
            <LabelCountBarTable rows={pathTapeRows} emptyLabel="—" maxRows={12} />
          </>,
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
          minWidth: 0,
        }}
      >
        {card(
          t(locale, "dashboard.rcd.timingTitle"),
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {t(locale, "dashboard.timingIntro")}
            </p>
            <table className="kb-table kb-kv-mini" style={{ fontSize: "0.85rem", width: "100%", marginTop: "0.35rem" }}>
              <tbody>
                <tr>
                  <td style={{ color: "var(--muted)", width: "42%", verticalAlign: "top" }}>
                    {t(locale, "dashboard.rcd.feedFreshness")}
                  </td>
                  <td>
                    <span className={feedStale ? "kb-feed-stale" : "kb-feed-ok"}>
                      {feedFreshnessSecs != null ? `${feedFreshnessSecs}s` : "—"}
                      {feedStale ? t(locale, "dashboard.rcd.stale") : ""}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "var(--muted)", fontSize: "0.75rem", paddingTop: "0.15rem" }} colSpan={2}>
                    {t(locale, "dashboard.rcd.feedFreshnessHint")}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "var(--muted)", paddingTop: "0.45rem" }}>{t(locale, "dashboard.rcd.orders24h")}</td>
                  <td style={{ paddingTop: "0.45rem" }}>{trading?.orders_24h_count ?? "—"}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--muted)" }}>{t(locale, "dashboard.rcd.fills24h")}</td>
                  <td>{trading?.trades_24h_count ?? "—"}</td>
                </tr>
              </tbody>
            </table>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              {t(locale, "dashboard.rcd.makerWindow")}
            </p>
          </>,
        )}

        {card(
          t(locale, "dashboard.rcd.strategyMatrix"),
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {t(locale, "dashboard.rcd.strategyMatrixIntro")}
            </p>
            <div className="kb-tier2-wnt-grids" style={{ marginTop: "0.45rem" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.rcd.regimesLabel")}
                </p>
                <LabelCountBarTable
                  rows={activeRegimes.map((r) => ({ label: r.regime, count: r.count }))}
                  emptyLabel="—"
                  accentColor="var(--pie-3)"
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.rcd.strategiesLabel")}
                </p>
                <LabelCountBarTable
                  rows={activeStrategies.map((s) => ({ label: s.strategy, count: s.count }))}
                  emptyLabel="—"
                  accentColor="var(--pie-2)"
                />
              </div>
            </div>
          </>,
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
          minWidth: 0,
        }}
      >
        {card(
          t(locale, "dashboard.rcd.execQuality"),
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {t(locale, "dashboard.rcd.execQualityIntro")}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>{t(locale, "dashboard.rcd.recentExec")}</strong>
              {trading?.recent_orders?.length ?? 0} {t(locale, "dashboard.rcd.ordersInSnapshot")} ·{" "}
              {trading?.recent_fills?.length ?? 0} {t(locale, "dashboard.rcd.fillsInSnapshot")}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              {t(locale, "dashboard.rcd.execPublicNote")}
            </p>
          </>,
        )}

        {card(
          t(locale, "dashboard.rcd.runtimeHealth"),
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {t(locale, "dashboard.rcd.runtimeHealthIntro")}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>Run:</strong> #{status?.run_id ?? "—"} · <strong>Epoch:</strong> {status?.epoch_status ?? "—"} · <strong>Symbols:</strong> {status?.epoch_symbol_count ?? "—"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{t(locale, "dashboard.rcd.feedRows")}</strong> t={status?.ticker_count ?? "—"} · tr={status?.trade_count ?? "—"} · L2={status?.l2_count ?? "—"} · L3={status?.l3_count ?? "—"}
            </p>
          </>,
        )}
      </div>

      {card(
        t(locale, "dashboard.rcd.routeDrilldown"),
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {t(locale, "dashboard.rcd.routeDrilldownIntro")}
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <Link href={withLocale(locale, "/spec")} className="kb-text-link">
              {t(locale, "dashboard.rcd.openSpec")}
            </Link>
            {" · "}
            <Link href={withLocale(locale, "/docs")} className="kb-text-link">
              {t(locale, "dashboard.rcd.viewDocs")}
            </Link>
          </p>
        </>,
      )}
    </div>
  );
}
