"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { labelCountsToPieSegments, SimplePieChart } from "@/components/SimplePieChart";
import { LabelCountBarTable } from "@/components/LabelCountBarTable";
import { LabelCountTable } from "@/components/LabelCountTable";
import type {
  EquityPoint,
  LatencyBucketPoint,
  MissedMoveBucket,
  RunHealthPoint,
  Tier2DataBundle,
  Tier2ExecutionSnapshot,
  Tier2LatencySnapshot,
  Tier2PnlSnapshot,
  Tier2SafetySnapshot,
} from "@/lib/snapshots";

interface DashboardTier2ContentProps {
  dataBundle: Tier2DataBundle | null;
  execution: Tier2ExecutionSnapshot | null;
  latency: Tier2LatencySnapshot | null;
  pnl: Tier2PnlSnapshot | null;
  safety: Tier2SafetySnapshot | null;
}

function LatencyHistogramBars({ points, ariaLabel }: { points: LatencyBucketPoint[]; ariaLabel: string }) {
  if (!points?.length) return null;
  const max = Math.max(...points.map((p) => p.count), 1);
  return (
    <div role="img" aria-label={ariaLabel} style={{ marginTop: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 56, borderBottom: "1px solid var(--border)" }}>
        {points.map((p, i) => (
          <div
            key={`${p.bucket_ms}-${i}`}
            title={`≤${p.bucket_ms} ms: ${p.count}`}
            style={{
              flex: 1,
              minWidth: 4,
              height: `${Math.max(4, (p.count / max) * 52)}px`,
              background: "var(--brand)",
              borderRadius: 2,
              opacity: 0.45 + Math.min(0.45, (p.count / max) * 0.45),
            }}
          />
        ))}
      </div>
      <p style={{ margin: "0.25rem 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
        {points.map((p) => `≤${p.bucket_ms}ms`).join(" · ")}
      </p>
    </div>
  );
}

function MissedMoveHistogramBars({ points, ariaLabel }: { points: MissedMoveBucket[]; ariaLabel: string }) {
  if (!points?.length) return null;
  const max = Math.max(...points.map((p) => p.count), 1);
  return (
    <div role="img" aria-label={ariaLabel} style={{ marginTop: "0.45rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48, borderBottom: "1px solid var(--border)" }}>
        {points.map((p, i) => (
          <div
            key={`${p.bucket_bps}-${i}`}
            title={`≤${p.bucket_bps} bps: ${p.count}`}
            style={{
              flex: 1,
              minWidth: 4,
              height: `${Math.max(4, (p.count / max) * 44)}px`,
              background: "var(--accent-warn, #c9a227)",
              borderRadius: 2,
              opacity: 0.4 + Math.min(0.5, (p.count / max) * 0.5),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PnlEquityMiniBars({ equity, ariaLabel }: { equity: EquityPoint[] | null | undefined; ariaLabel: string }) {
  const pts = equity?.length ? equity.slice(-16) : null;
  let heights: number[] = [];
  if (pts && pts.length > 1) {
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    heights = vals.map((v) => 5 + ((v - min) / range) * 26);
  }
  if (heights.length === 0) return null;
  return (
    <div className="cockpit-mini-bars" role="img" aria-label={ariaLabel} style={{ marginTop: "0.45rem" }}>
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

function RunHealthTable({
  points,
  modeLabel,
  emptyLabel,
}: {
  points: RunHealthPoint[] | null | undefined;
  modeLabel: string;
  emptyLabel: string;
}) {
  const rows = points?.length ? [...points].slice(-8).reverse() : [];
  if (rows.length === 0) {
    return <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>{emptyLabel}</p>;
  }
  return (
    <div className="kb-table-scroll" style={{ marginTop: "0.45rem", maxHeight: "14rem", overflow: "auto" }}>
      <table className="kb-table" style={{ fontSize: "0.76rem", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.25rem" }}>run</th>
            <th style={{ textAlign: "left", padding: "0.25rem" }}>{modeLabel}</th>
            <th style={{ textAlign: "right", padding: "0.25rem" }}>fresh s</th>
            <th style={{ textAlign: "right", padding: "0.25rem" }}>L2</th>
            <th style={{ textAlign: "right", padding: "0.25rem" }}>L3</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.run_id}>
              <td style={{ padding: "0.2rem 0.25rem" }}>{r.run_id}</td>
              <td style={{ padding: "0.2rem 0.25rem" }}>{r.mode ?? "—"}</td>
              <td style={{ padding: "0.2rem 0.25rem", textAlign: "right" }}>
                {r.feed_freshness_secs != null ? r.feed_freshness_secs.toFixed(0) : "—"}
              </td>
              <td style={{ padding: "0.2rem 0.25rem", textAlign: "right" }}>{r.l2_rows ?? "—"}</td>
              <td style={{ padding: "0.2rem 0.25rem", textAlign: "right" }}>{r.l3_rows ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardTier2Content({ dataBundle, execution, latency, pnl, safety }: DashboardTier2ContentProps) {
  const locale = useLocale();
  const pieOther = t(locale, "dashboard.pieOther");
  const emptyCounts = t(locale, "dashboard.tier2.noCountsInSnapshot");
  const showLatencyHistNote =
    !!latency &&
    !latency.submit_to_ack_histogram_ms_24h?.length &&
    !latency.fill_to_exit_submit_histogram_ms_24h?.length;
  const equitySparklineOk = !!(pnl?.equity_trend_delayed && pnl.equity_trend_delayed.length > 1);

  const hasAny = !!(dataBundle || execution || latency || pnl || safety);
  if (!hasAny) {
    return (
      <main>
        <nav style={{ marginBottom: "1.25rem" }}>
          <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
            ← {t(locale, "nav.dashboard")}
          </Link>
        </nav>
        <section className="card" style={{ borderLeft: "4px solid var(--brand)" }}>
          <h1 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>
            {t(locale, "dashboard.tier2.emptyTitle")}
          </h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            {t(locale, "dashboard.tier2.emptyBody")}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.25rem" }}>
        <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
          ← {t(locale, "nav.dashboard")}
        </Link>
      </nav>

      <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>
        {t(locale, "dashboard.tier2.h1")}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.5rem", maxWidth: "78ch", lineHeight: 1.65 }}>
        {t(locale, "dashboard.tier2.intro")}
      </p>
      <p className="kb-refresh-note" style={{ marginBottom: "1rem", fontSize: "0.88rem" }}>
        {t(locale, "dashboard.refreshNote")}
      </p>

      {dataBundle && (
        <section className="card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--brand)" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            {t(locale, "dashboard.tier2.dataContract")}
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
            contract {dataBundle.contract_version} · exported {dataBundle.exported_at} · source roles:{" "}
            {dataBundle.source_db.intake_role}/{dataBundle.source_db.decision_role}
            {dataBundle.source_db.research_role ? `/${dataBundle.source_db.research_role}` : ""}
          </p>
        </section>
      )}

      <section className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.65rem" }}>{t(locale, "dashboard.tier2.distributionsTitle")}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-start" }}>
          <SimplePieChart
            title={t(locale, "dashboard.rcd.funnelStage24h")}
            segments={labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_stage_counts_24h, 8, pieOther)}
            size={148}
          />
          <SimplePieChart
            title={t(locale, "dashboard.rcd.decisionCodes24h")}
            segments={labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_decision_code_counts_24h, 8, pieOther)}
            size={148}
          />
          <SimplePieChart
            title={t(locale, "dashboard.tier2.orderStatus24h")}
            segments={labelCountsToPieSegments(execution?.orders_status_counts_24h, 8, pieOther)}
            size={148}
          />
          <SimplePieChart
            title={t(locale, "dashboard.tier2.fillSide24h")}
            segments={labelCountsToPieSegments(execution?.fills_side_counts_24h, 8, pieOther)}
            size={148}
          />
          <SimplePieChart
            title={t(locale, "dashboard.tier2.safetyByMode")}
            segments={labelCountsToPieSegments(dataBundle?.risk_capital?.symbol_safety_by_mode, 8, pieOther)}
            size={148}
          />
          <SimplePieChart
            title={t(locale, "dashboard.tier2.pathTape24h")}
            segments={labelCountsToPieSegments(dataBundle?.path_doctrine?.orders_by_path_tape_24h, 8, pieOther)}
            size={148}
          />
        </div>
      </section>

      <div className="tier2-dashboard-grid">
        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Live Route Board</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.55 }}>{t(locale, "dashboard.routeBoardMeta")}</p>
          <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.55 }}>{t(locale, "dashboard.routeBoardIntro")}</p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {dataBundle?.edgeboard?.available
              ? `Edgeboard: rows ${dataBundle.edgeboard.visible_rows ?? "—"} · symbols ${dataBundle.edgeboard.visible_symbols ?? "—"} · positive ${dataBundle.edgeboard.positive_edge_symbols ?? "—"} · source ${dataBundle.edgeboard.source_db ?? "—"}`
              : t(locale, "dashboard.tier2.edgeboardNo")}
          </p>
          {dataBundle?.edgeboard?.available && !dataBundle.edgeboard.top_signals?.length ? (
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>{t(locale, "dashboard.tier2.edgeboardNoRows")}</p>
          ) : null}
          {dataBundle?.edgeboard?.top_signals?.length ? (
            <div
              className="kb-table-scroll"
              style={{
                marginTop: "0.5rem",
                maxHeight: "min(70vh, 26rem)",
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            >
              <table className="kb-table" style={{ fontSize: "0.82rem" }}>
                <thead style={{ position: "sticky", top: 0, background: "var(--card-bg)", zIndex: 1 }}>
                  <tr>
                    {["#", t(locale, "dashboard.tier2.colSymbol"), "Route", "Horizon (s)", "Fresh (ms)", "Edge", "Conf", t(locale, "dashboard.tier2.colReason")].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataBundle.edgeboard.top_signals.map((s, idx) => (
                    <tr key={`${idx}-${s.symbol}-${s.rank}-${s.route_name}`}>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.rank}</td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.symbol}</td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.route_name}</td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.horizon_sec}</td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>
                        {s.freshness_ms != null ? Math.round(s.freshness_ms).toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.expected_net_edge_bps.toFixed(1)}</td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.confidence.toFixed(2)}</td>
                      <td style={{ padding: "0.3rem", borderBottom: "1px solid var(--border)" }}>{s.dominant_reason_code ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="card kb-tier2-wnt-card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Why-No-Trade / Rejections</h2>
          <div className="kb-tier2-wnt-inner">
            <div className="kb-tier2-wnt-pie" style={{ minWidth: 0 }}>
              <SimplePieChart
                title={t(locale, "dashboard.tier2.topReasons24h")}
                segments={labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_reason_top_24h, 8, pieOther)}
                size={120}
                showLegend
              />
            </div>
            <div className="kb-tier2-wnt-grids">
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.tier2.funnelStageLabel")}
                </p>
                <LabelCountBarTable rows={dataBundle?.route_no_trade?.funnel_stage_counts_24h} emptyLabel={emptyCounts} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.tier2.decisionCodesLabel")}
                </p>
                <LabelCountBarTable rows={dataBundle?.route_no_trade?.funnel_decision_code_counts_24h} emptyLabel={emptyCounts} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                  {t(locale, "dashboard.tier2.reasonsTopLabel")}
                </p>
                <LabelCountBarTable rows={dataBundle?.route_no_trade?.funnel_reason_top_24h} emptyLabel={emptyCounts} />
              </div>
              {dataBundle?.route_no_trade?.shadow_blocker_counts?.length ? (
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                    {t(locale, "dashboard.tier2.shadowBlockers")}
                  </p>
                  <LabelCountBarTable rows={dataBundle?.route_no_trade?.shadow_blocker_counts} emptyLabel={emptyCounts} />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Position Context Board</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            Safety: N={safety?.safety_normal_count ?? "—"} · E={safety?.safety_exit_only_count ?? "—"} · B={safety?.safety_hard_blocked_count ?? "—"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.45rem", alignItems: "flex-start" }}>
            <SimplePieChart
              title={t(locale, "dashboard.tier2.safetyByMode")}
              segments={labelCountsToPieSegments(dataBundle?.risk_capital?.symbol_safety_by_mode, 8, pieOther)}
              size={120}
            />
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                {t(locale, "dashboard.tier2.pathTapeLabel")}
              </p>
              <LabelCountBarTable rows={dataBundle?.path_doctrine?.orders_by_path_tape_24h} emptyLabel={emptyCounts} maxRows={10} />
            </div>
          </div>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Timing & Execution Viability</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            submit→ack avg: {latency?.submit_to_ack_ms_avg != null ? `${Math.round(latency.submit_to_ack_ms_avg)} ms` : "—"} · n={latency?.sample_count ?? "—"}
            {latency?.avg_fill_to_exit_submit_ms != null
              ? ` · fill→exit submit avg: ${Math.round(latency.avg_fill_to_exit_submit_ms)} ms (n=${latency.count_with_exit ?? "—"})`
              : ""}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            orders 24h: {execution?.orders_24h_count ?? "—"} · fills 24h: {execution?.fills_24h_count ?? "—"}
          </p>
          {latency?.submit_to_ack_histogram_ms_24h?.length ? (
            <LatencyHistogramBars
              points={latency.submit_to_ack_histogram_ms_24h}
              ariaLabel={t(locale, "dashboard.tier2.latencySubmitAria")}
            />
          ) : null}
          {latency?.fill_to_exit_submit_histogram_ms_24h?.length ? (
            <>
              <p style={{ margin: "0.65rem 0 0", fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                {t(locale, "dashboard.tier2.fillExitLabel")}
              </p>
              <LatencyHistogramBars
                points={latency.fill_to_exit_submit_histogram_ms_24h}
                ariaLabel={t(locale, "dashboard.tier2.latencyFillAria")}
              />
            </>
          ) : null}
          {showLatencyHistNote ? (
            <p style={{ margin: "0.55rem 0 0", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {t(locale, "dashboard.tier2.latencyHistogramNote")}
            </p>
          ) : null}
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Strategy / Regime Matrix</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.55 }}>{t(locale, "dashboard.tier2.marketForecastIntro")}</p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {t(locale, "dashboard.tier2.edgeboardModel")}
            {dataBundle?.edgeboard?.model_version ?? "—"}
          </p>
          {dataBundle?.market_forecast_15m?.forecasts?.length ? (
            <div className="kb-table-scroll" style={{ marginTop: "0.5rem", maxHeight: "12rem", overflow: "auto" }}>
              <table className="kb-table" style={{ fontSize: "0.78rem", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.25rem" }}>{t(locale, "dashboard.tier2.colSymbol")}</th>
                    <th style={{ textAlign: "left", padding: "0.25rem" }}>{t(locale, "dashboard.tier2.colDirection15m")}</th>
                    <th style={{ textAlign: "right", padding: "0.25rem" }}>{t(locale, "dashboard.tier2.colMoveBps")}</th>
                    <th style={{ textAlign: "right", padding: "0.25rem" }}>{t(locale, "dashboard.tier2.colConf")}</th>
                    <th style={{ textAlign: "left", padding: "0.25rem" }}>{t(locale, "dashboard.tier2.colReason")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataBundle.market_forecast_15m.forecasts.slice(0, 12).map((f, i) => (
                    <tr key={`${f.symbol}-${i}`}>
                      <td style={{ padding: "0.2rem 0.25rem" }}>{f.symbol}</td>
                      <td style={{ padding: "0.2rem 0.25rem" }}>{f.expected_direction_15m}</td>
                      <td style={{ padding: "0.2rem 0.25rem", textAlign: "right" }}>{f.expected_move_15m_bps.toFixed(1)}</td>
                      <td style={{ padding: "0.2rem 0.25rem", textAlign: "right" }}>{f.confidence_15m.toFixed(2)}</td>
                      <td style={{ padding: "0.2rem 0.25rem", wordBreak: "break-word" }}>{f.reason_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {t(locale, "dashboard.tier2.marketForecastEmpty")}
            </p>
          )}
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Execution / Fill Quality</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-start" }}>
            <SimplePieChart
              title={t(locale, "dashboard.tier2.orderStatus24h")}
              segments={labelCountsToPieSegments(execution?.orders_status_counts_24h, 8, pieOther)}
              size={112}
              showLegend
            />
            <SimplePieChart
              title={t(locale, "dashboard.tier2.fillSide24h")}
              segments={labelCountsToPieSegments(execution?.fills_side_counts_24h, 8, pieOther)}
              size={112}
              showLegend
            />
            {execution?.shadow_outcome_counts?.length ? (
              <SimplePieChart
                title={t(locale, "dashboard.tier2.shadowOutcomes")}
                segments={labelCountsToPieSegments(execution.shadow_outcome_counts, 8, pieOther)}
                size={112}
                showLegend
              />
            ) : null}
          </div>
          {execution?.shadow_missed_move_histogram?.length ? (
            <>
              <p style={{ margin: "0.55rem 0 0", fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                {t(locale, "dashboard.tier2.shadowMissed")}
              </p>
              <MissedMoveHistogramBars
                points={execution.shadow_missed_move_histogram}
                ariaLabel={t(locale, "dashboard.tier2.shadowMissedAria")}
              />
            </>
          ) : null}
          {execution?.event_buffer_kpis ? (
            <div style={{ marginTop: "0.55rem" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                {t(locale, "dashboard.tier2.eventBuffer")}
              </p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                active {execution.event_buffer_kpis.buffered_active_count ?? "—"} · total {execution.event_buffer_kpis.buffered_total_count ?? "—"} ·
                released 24h {execution.event_buffer_kpis.released_24h_count ?? "—"} · timeout 24h{" "}
                {execution.event_buffer_kpis.timeout_24h_count ?? "—"} · unknown 24h {execution.event_buffer_kpis.unknown_24h_count ?? "—"}
              </p>
              {execution.event_buffer_kpis.status_counts_24h?.length ? (
                <LabelCountTable rows={execution.event_buffer_kpis.status_counts_24h} emptyLabel={emptyCounts} maxRows={8} />
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Runtime Health</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {t(locale, "dashboard.tier2.runHealthSamples")}
            {execution?.run_health_timeline?.length ?? 0}
            {" · "}
            {t(locale, "dashboard.tier2.infraWatchdog")}
            {dataBundle?.infra?.latest_watchdog_state ?? "—"}
            {dataBundle?.infra?.event_buffer_unknown_24h != null
              ? ` · event_buffer unknown 24h: ${dataBundle.infra.event_buffer_unknown_24h}`
              : ""}
          </p>
          <RunHealthTable points={execution?.run_health_timeline} modeLabel={t(locale, "dashboard.tier2.runHealthMode")} emptyLabel={t(locale, "dashboard.tier2.runHealthEmpty")} />
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Route Drilldown / Lineage</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.55 }}>{t(locale, "dashboard.tier2.drilldownIntro")}</p>
          <p style={{ margin: "0.45rem 0 0", fontSize: "0.88rem" }}>
            <Link href={withLocale(locale, "/spec")} className="kb-text-link">SPEC</Link>
            {" · "}
            <Link href={withLocale(locale, "/docs")} className="kb-text-link">
              {t(locale, "nav.docs")}
            </Link>
          </p>
        </section>

        {pnl ? (
          <section className="card" style={{ margin: 0, minWidth: 0 }}>
            <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>
              {t(locale, "dashboard.tier2.econContext")}
            </h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              realized_pnl_quote_24h: {pnl.realized_pnl_quote_24h != null ? pnl.realized_pnl_quote_24h.toFixed(2) : "—"} · drawdown:{" "}
              {pnl.drawdown_pct != null ? `${pnl.drawdown_pct.toFixed(2)}%` : "—"}
              {pnl.sharpe_like_24h != null ? ` · Sharpe-like 24h: ${pnl.sharpe_like_24h.toFixed(2)}` : ""}
              {pnl.sortino_like_24h != null ? ` · Sortino-like 24h: ${pnl.sortino_like_24h.toFixed(2)}` : ""}
            </p>
            <PnlEquityMiniBars
              equity={pnl.equity_trend_delayed}
              ariaLabel={t(locale, "dashboard.tier2.equityTrendAria")}
            />
            {!equitySparklineOk ? (
              <p style={{ margin: "0.45rem 0 0", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {t(locale, "dashboard.tier2.equityTrendEmpty")}
              </p>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
