"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { ReactNode } from "react";
import Link from "next/link";
import { withLocale } from "@/lib/locale-path";
import type {
  LabelCount,
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
  Tier2DataBundle,
} from "@/lib/snapshots";
import { labelCountsToPieSegments, pieSegmentsTotal, SimplePieChart } from "@/components/SimplePieChart";

type Props = {
  locale: Locale;
  status: PublicStatusSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
  trading: PublicTradingSnapshot | null;
  dataBundle: Tier2DataBundle | null;
};

function top(rows: LabelCount[] | null | undefined, n = 6): LabelCount[] {
  if (!rows || rows.length === 0) return [];
  return [...rows].sort((a, b) => b.count - a.count).slice(0, n);
}

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

function freshnessColor(ms: number | null | undefined): string {
  if (ms == null) return "var(--text-muted)";
  if (ms <= 300_000) return "var(--success)";
  if (ms <= 3_600_000) return "var(--warning)";
  return "var(--danger)";
}

const FEED_FRESHNESS_STALE_THRESHOLD_SECS = 60;

function card(title: string, body: ReactNode) {
  return (
    <section className="card" style={{ padding: "1rem 1.25rem" }}>
      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
      {body}
    </section>
  );
}

export function RouteCentricDashboard({ locale, status, regime, strategy, trading, dataBundle }: Props) {
  const isNl = locale === "nl";

  const rejectTop = top(trading?.top_reject_reasons_last_hour, 8);
  const stageTop = top(dataBundle?.route_no_trade?.funnel_stage_counts_24h, 8);
  const decisionTop = top(dataBundle?.route_no_trade?.funnel_decision_code_counts_24h, 10);
  const pathTapeTop = top(dataBundle?.path_doctrine?.orders_by_path_tape_24h, 8);
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
  );
  const strategyPie = labelCountsToPieSegments(
    activeStrategies.map((s) => ({ label: s.strategy, count: s.count })),
    8,
  );
  const funnelStagePie = labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_stage_counts_24h, 8);
  const decisionPie = labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_decision_code_counts_24h, 8);
  const pathTapePie = labelCountsToPieSegments(dataBundle?.path_doctrine?.orders_by_path_tape_24h, 8);

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
    <div style={{ display: "grid", gap: "1rem" }}>
      {card(
        isNl ? "Live Route Board" : "Live Route Board",
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            {t(locale, "dashboard.routeBoardIntro")}
          </p>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600 }}>
            {t(locale, "dashboard.refreshNote")}
          </p>
          {isDecisionFallback && (
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "var(--danger)", fontWeight: 600 }}>
              {isNl
                ? "Bron: decision fallback — research snapshot is verlopen. Edge/confidence semantiek verschilt van research."
                : "Source: decision fallback — research snapshot expired. Edge/confidence semantics differ from research."}
            </p>
          )}
          {edgeboardSnapshotAgeMs != null && (
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "var(--muted)" }}>
              {isNl ? "Snapshot leeftijd: " : "Snapshot age: "}{formatFreshnessMs(edgeboardSnapshotAgeMs)}
              {edgeboardSourceDb ? ` · ${isNl ? "bron" : "source"}: ${edgeboardSourceDb}` : ""}
            </p>
          )}
          {edgeSignals.length > 0 ? (
            <div
              style={{
                overflowX: "auto",
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
                      <td style={{ color: s.expected_net_edge_bps < 0 ? "var(--danger)" : undefined }}>{s.expected_net_edge_bps.toFixed(1)}</td>
                      <td>{s.confidence.toFixed(2)}</td>
                      <td>{s.dominant_reason_code ?? "—"}</td>
                      <td style={{ color: freshnessColor(s.freshness_ms), fontSize: "0.8rem" }}>{formatFreshnessMs(s.freshness_ms)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>
              {isNl ? "Nog geen publieke edgeboard-signalen beschikbaar." : "No public edgeboard signals available yet."}
            </p>
          )}
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "var(--muted)" }}>{t(locale, "dashboard.routeBoardMeta")}</p>
        </>,
      )}

      {edgeCandidates.length > 0
        ? card(
            t(locale, "dashboard.edgeCandidatesTitle"),
            <>
              <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>{t(locale, "dashboard.edgeCandidatesIntro")}</p>
              <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                <div>
                  <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "var(--success)", fontSize: "0.9rem" }}>
                    {t(locale, "dashboard.edgeCandidatesBest")}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
                    {edgeBest3.map((c) => (
                      <li key={`b-${c.symbol}`}>
                        <strong>{c.symbol}</strong> · {c.best_expected_net_edge_bps.toFixed(1)} bps · conf {c.best_confidence.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "var(--danger)", fontSize: "0.9rem" }}>
                    {t(locale, "dashboard.edgeCandidatesWorst")}
                  </p>
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

      {card(t(locale, "dashboard.dailyPnlTitle"), (
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>{t(locale, "dashboard.dailyPnlUtcNote")}</p>
          {pnlDayEmpty ? (
            <p style={{ margin: "0 0 0.75rem", color: "var(--muted)", fontSize: "0.82rem" }}>{t(locale, "dashboard.dailyPnlEmpty")}</p>
          ) : null}
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            <div>
              <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "var(--success)", fontSize: "0.9rem" }}>
                {t(locale, "dashboard.topWinners")}
              </p>
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
              <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "var(--danger)", fontSize: "0.9rem" }}>
                {t(locale, "dashboard.topLosers")}
              </p>
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

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <section className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{isNl ? "Verdeling (funnel)" : "Distribution (funnel)"}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "flex-start" }}>
            <SimplePieChart
              title={isNl ? "Funnel-fase (24h)" : "Funnel stage (24h)"}
              segments={funnelStagePie}
              size={158}
              variant="donut"
              centerLabel={pieSegmentsTotal(funnelStagePie) > 0 ? pieSegmentsTotal(funnelStagePie).toLocaleString() : undefined}
            />
            <SimplePieChart
              title={isNl ? "Decision codes (24h)" : "Decision codes (24h)"}
              segments={decisionPie}
              size={158}
              variant="donut"
              centerLabel={pieSegmentsTotal(decisionPie) > 0 ? pieSegmentsTotal(decisionPie).toLocaleString() : undefined}
            />
          </div>
        </section>
        <section className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{isNl ? "Regime & strategie" : "Regime & strategy"}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "flex-start" }}>
            <SimplePieChart
              title={isNl ? "Actieve regimes" : "Active regimes"}
              segments={regimePie}
              size={158}
              variant="donut"
              centerLabel={pieSegmentsTotal(regimePie) > 0 ? pieSegmentsTotal(regimePie).toLocaleString() : undefined}
            />
            <SimplePieChart
              title={isNl ? "Actieve strategieën" : "Active strategies"}
              segments={strategyPie}
              size={158}
              variant="donut"
              centerLabel={pieSegmentsTotal(strategyPie) > 0 ? pieSegmentsTotal(strategyPie).toLocaleString() : undefined}
            />
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))" }}>
        {card(
          isNl ? "Why-No-Trade / Rejections" : "Why-No-Trade / Rejections",
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {isNl ? "Top afwijsredenen en funnel-stadia (geaggregeerd)." : "Top rejection reasons and funnel stages (aggregated)."}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>{isNl ? "Reject reasons (1h): " : "Reject reasons (1h): "}</strong>
              {rejectTop.length ? rejectTop.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{isNl ? "Funnel stage (24h): " : "Funnel stage (24h): "}</strong>
              {stageTop.length ? stageTop.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{isNl ? "Decision codes (24h): " : "Decision codes (24h): "}</strong>
              {decisionTop.length ? decisionTop.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
            </p>
          </>,
        )}

        {card(
          isNl ? "Position Context Board" : "Position Context Board",
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {isNl
                ? "Publieke positiecontext zonder accountgevoelige waarden: safety-modes en route-pad distributie."
                : "Public position context without account-sensitive values: safety modes and route-path distribution."}
            </p>
            <SimplePieChart
              title={isNl ? "Orders per route-pad (24h)" : "Orders by route path (24h)"}
              segments={pathTapePie}
              size={152}
              variant="donut"
              centerLabel={pieSegmentsTotal(pathTapePie) > 0 ? pieSegmentsTotal(pathTapePie).toLocaleString() : undefined}
            />
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
              <strong style={{ marginRight: "0.25rem" }}>Safety:</strong>
              <span className="kb-state-allow" title={isNl ? "Normal (N)" : "Normal (N)"}>
                N={status?.safety_normal_count ?? "—"}
              </span>
              <span className="kb-state-skip" title={isNl ? "Exit-only (E)" : "Exit-only (E)"}>
                E={status?.safety_exit_only_count ?? "—"}
              </span>
              <span className="kb-state-halt" title={isNl ? "Hard block (B)" : "Hard block (B)"}>
                B={status?.safety_hard_blocked_count ?? "—"}
              </span>
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{isNl ? "Orders per route-pad (tekst): " : "Orders by route path (text): "}</strong>
              {pathTapeTop.length ? pathTapeTop.map((r) => `${r.label} (${r.count})`).join(" · ") : "—"}
            </p>
          </>,
        )}
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))" }}>
        {card(
          isNl ? "Timing & Execution Viability" : "Timing & Execution Viability",
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {isNl
                ? "Timing-relevante signalen voor route-keuze en uitvoerbaarheid."
                : "Timing-relevant signals for route selection and execution viability."}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>{isNl ? "Feed freshness (ticker/trade): " : "Feed freshness (ticker/trade): "}</strong>
              <span style={{ color: feedStale ? "var(--danger)" : "var(--success)", fontWeight: feedStale ? 700 : 400 }}>
                {feedFreshnessSecs != null ? `${feedFreshnessSecs}s` : "—"}
                {feedStale ? (isNl ? " — STALE" : " — STALE") : ""}
              </span>
            </p>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "var(--muted)" }}>
              {isNl
                ? "= leeftijd van het recentste ticker/trade-bericht van de exchange (INGEST pool). Threshold: 60s."
                : "= age of the most recent ticker/trade message from the exchange (INGEST pool). Threshold: 60s."}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{isNl ? "Orders 24h: " : "Orders 24h: "}</strong>{trading?.orders_24h_count ?? "—"} ·{" "}
              <strong>{isNl ? "Fills 24h: " : "Fills 24h: "}</strong>{trading?.trades_24h_count ?? "—"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              {isNl
                ? "Maker-window expiry en taker fallback worden publiek geaggregeerd getoond zodra dedicated snapshotvelden beschikbaar zijn."
                : "Maker-window expiry and taker fallback are shown publicly in aggregated form once dedicated snapshot fields are available."}
            </p>
          </>,
        )}

        {card(
          isNl ? "Strategy / Regime Matrix" : "Strategy / Regime Matrix",
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {isNl ? "Verdeling van actieve regimes en strategieën." : "Distribution of active regimes and strategies."}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>{isNl ? "Regimes: " : "Regimes: "}</strong>
              {activeRegimes.length ? activeRegimes.map((r) => `${r.regime} (${r.count})`).join(" · ") : "—"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{isNl ? "Strategieën: " : "Strategies: "}</strong>
              {activeStrategies.length ? activeStrategies.map((s) => `${s.strategy} (${s.count})`).join(" · ") : "—"}
            </p>
          </>,
        )}
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))" }}>
        {card(
          isNl ? "Execution / Fill Quality" : "Execution / Fill Quality",
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {isNl
                ? "Operationele uitkomsten zonder private account/PnL-details."
                : "Operational outcomes without private account/PnL details."}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>{isNl ? "Recente uitvoering: " : "Recent execution: "}</strong>
              {trading?.recent_orders?.length ?? 0} {isNl ? "orders in snapshot" : "orders in snapshot"} ·{" "}
              {trading?.recent_fills?.length ?? 0} {isNl ? "fills in snapshot" : "fills in snapshot"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              {isNl
                ? "Publiek tonen we verklaarbare uitvoeringstrends; accountniveau fill-details blijven admin-only."
                : "Publicly we show explainable execution trends; account-level fill details stay admin-only."}
            </p>
          </>,
        )}

        {card(
          isNl ? "Runtime Health" : "Runtime Health",
          <>
            <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              {isNl ? "Gezondheid van ingest/execution-routes op geaggregeerd niveau." : "Health of ingest/execution routes on an aggregated level."}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              <strong>Run:</strong> #{status?.run_id ?? "—"} · <strong>Epoch:</strong> {status?.epoch_status ?? "—"} · <strong>Symbols:</strong> {status?.epoch_symbol_count ?? "—"}
            </p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>{isNl ? "Feed rows:" : "Feed rows:"}</strong> t={status?.ticker_count ?? "—"} · tr={status?.trade_count ?? "—"} · L2={status?.l2_count ?? "—"} · L3={status?.l3_count ?? "—"}
            </p>
          </>,
        )}
      </div>

      {card(
        isNl ? "Route Drilldown / Lineage" : "Route Drilldown / Lineage",
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl
              ? "Publieke drilldown naar route lineage en besliscontext (zonder reproduceerbare tuningwaarden)."
              : "Public drilldown to route lineage and decision context (without reproducible tuning values)."}
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <Link href={withLocale(locale, "/spec")} style={{ color: "var(--accent)", textDecoration: "none" }}>
              {isNl ? "Open de SPEC-pagina voor canonieke runtime-specificatie" : "Open the SPEC page for canonical runtime specification"}
            </Link>
            {" · "}
            <Link href={withLocale(locale, "/docs")} style={{ color: "var(--accent)", textDecoration: "none" }}>
              {isNl ? "Bekijk de publieke architectuurdocumentatie" : "Read the public architecture documentation"}
            </Link>
          </p>
        </>,
      )}
    </div>
  );
}
