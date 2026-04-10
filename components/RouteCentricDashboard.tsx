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
import { labelCountsToPieSegments, SimplePieChart } from "@/components/SimplePieChart";

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

  const winners = trading?.symbol_pnl_day_utc_top_winners ?? [];
  const losers = trading?.symbol_pnl_day_utc_top_losers ?? [];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {card(
        isNl ? "Live Route Board" : "Live Route Board",
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            {isNl
              ? "Alle gerankschikte signalen uit de snapshot (research edgeboard of decision-fallback). Scroll voor de volledige lijst."
              : "All ranked signals from the snapshot (research edgeboard or decision fallback). Scroll for the full list."}
          </p>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600 }}>
            {t(locale, "dashboard.refreshNote")}
          </p>
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
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead style={{ position: "sticky", top: 0, background: "var(--card-bg)", zIndex: 1 }}>
                  <tr>
                    {["#", "Symbol", "Route", "Edge (bps)", "Confidence", "Reason"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {edgeSignals.map((s, idx) => (
                    <tr key={`${idx}-${s.symbol}-${s.rank}-${s.route_name}`}>
                      <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>{s.rank}</td>
                      <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>{s.symbol}</td>
                      <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>{s.route_name}</td>
                      <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>{s.expected_net_edge_bps.toFixed(1)}</td>
                      <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>{s.confidence.toFixed(2)}</td>
                      <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--border)" }}>{s.dominant_reason_code ?? "—"}</td>
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

      {card(t(locale, "dashboard.dailyPnlTitle"), (
        <>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.85rem" }}>{t(locale, "dashboard.dailyPnlUtcNote")}</p>
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            <div>
              <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "var(--freshness-good)", fontSize: "0.9rem" }}>
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
              <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "var(--freshness-stale)", fontSize: "0.9rem" }}>
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
            <SimplePieChart title={isNl ? "Funnel-fase (24h)" : "Funnel stage (24h)"} segments={funnelStagePie} size={150} />
            <SimplePieChart title={isNl ? "Decision codes (24h)" : "Decision codes (24h)"} segments={decisionPie} size={150} />
          </div>
        </section>
        <section className="card" style={{ padding: "1rem 1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{isNl ? "Regime & strategie" : "Regime & strategy"}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "flex-start" }}>
            <SimplePieChart title={isNl ? "Actieve regimes" : "Active regimes"} segments={regimePie} size={150} />
            <SimplePieChart title={isNl ? "Actieve strategieën" : "Active strategies"} segments={strategyPie} size={150} />
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
              segments={labelCountsToPieSegments(dataBundle?.path_doctrine?.orders_by_path_tape_24h, 8)}
              size={140}
            />
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
              <strong>Safety:</strong>{" "}
              N={status?.safety_normal_count ?? "—"} · E={status?.safety_exit_only_count ?? "—"} · B={status?.safety_hard_blocked_count ?? "—"}
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
              <strong>{isNl ? "Data freshness: " : "Data freshness: "}</strong>
              {status?.data_freshness_secs != null ? `${status.data_freshness_secs}s` : "—"}
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
