"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { labelCountsToPieSegments, SimplePieChart } from "@/components/SimplePieChart";
import type {
  LabelCount,
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

function row(items: LabelCount[] | null | undefined): string {
  if (!items || items.length === 0) return "—";
  return items.slice(0, 10).map((i) => `${i.label} (${i.count})`).join(" · ");
}

export function DashboardTier2Content({ dataBundle, execution, latency, pnl, safety }: DashboardTier2ContentProps) {
  const locale = useLocale();
  const isNl = locale === "nl";

  const hasAny = !!(dataBundle || execution || latency || pnl || safety);
  if (!hasAny) {
    return (
      <main>
        <nav style={{ marginBottom: "1.25rem" }}>
          <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
            ← {isNl ? "Dashboard" : "Dashboard"}
          </Link>
        </nav>
        <section className="card" style={{ borderLeft: "4px solid var(--brand)" }}>
          <h1 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>
            {isNl ? "Tier 2 route-observability" : "Tier 2 route observability"}
          </h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            {isNl
              ? "Nog geen Tier 2 snapshots beschikbaar. Exporteer observability-snapshots op de bot en probeer opnieuw."
              : "No Tier 2 snapshots available yet. Export observability snapshots on the bot and try again."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.25rem" }}>
        <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
          ← {isNl ? "Dashboard" : "Dashboard"}
        </Link>
      </nav>

      <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>
        {isNl ? "Tier 2: route-/decision-centric observability" : "Tier 2: route/decision-centric observability"}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.5rem", maxWidth: "78ch", lineHeight: 1.65 }}>
        {isNl
          ? "Verdiepte operationele diagnose op basis van geaggregeerde snapshots. Deze pagina toont uitkomst- en oorzaakinformatie zonder broncode, zonder private accountdetails en zonder reproduceerbare tuning."
          : "Deep operational diagnostics from aggregated snapshots. This page shows outcomes and causes without source code, without private account details, and without reproducible tuning."}
      </p>
      <p className="kb-refresh-note" style={{ marginBottom: "1rem", fontSize: "0.88rem" }}>
        {t(locale, "dashboard.refreshNote")}
      </p>

      {dataBundle && (
        <section className="card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--brand)" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            {isNl ? "Data contract en bronnen" : "Data contract and sources"}
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
            contract {dataBundle.contract_version} · exported {dataBundle.exported_at} · source roles:{" "}
            {dataBundle.source_db.intake_role}/{dataBundle.source_db.decision_role}
            {dataBundle.source_db.research_role ? `/${dataBundle.source_db.research_role}` : ""}
          </p>
        </section>
      )}

      <section className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.65rem" }}>{isNl ? "Verdelingen (pie)" : "Distributions (pie)"}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-start" }}>
          <SimplePieChart
            title={isNl ? "Funnel-fase (24h)" : "Funnel stage (24h)"}
            segments={labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_stage_counts_24h, 8)}
            size={148}
          />
          <SimplePieChart
            title={isNl ? "Decision codes (24h)" : "Decision codes (24h)"}
            segments={labelCountsToPieSegments(dataBundle?.route_no_trade?.funnel_decision_code_counts_24h, 8)}
            size={148}
          />
          <SimplePieChart
            title={isNl ? "Order status (24h)" : "Order status (24h)"}
            segments={labelCountsToPieSegments(execution?.orders_status_counts_24h, 8)}
            size={148}
          />
          <SimplePieChart
            title={isNl ? "Fill side (24h)" : "Fill side (24h)"}
            segments={labelCountsToPieSegments(execution?.fills_side_counts_24h, 8)}
            size={148}
          />
          <SimplePieChart
            title={isNl ? "Safety per mode" : "Safety by mode"}
            segments={labelCountsToPieSegments(dataBundle?.risk_capital?.symbol_safety_by_mode, 8)}
            size={148}
          />
          <SimplePieChart
            title={isNl ? "Path tape (orders 24h)" : "Path tape (orders 24h)"}
            segments={labelCountsToPieSegments(dataBundle?.path_doctrine?.orders_by_path_tape_24h, 8)}
            size={148}
          />
        </div>
      </section>

      <div
        className="tier2-dashboard-grid"
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
          minWidth: 0,
        }}
      >
        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Live Route Board</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {dataBundle?.edgeboard?.available
              ? `Edgeboard: rows ${dataBundle.edgeboard.visible_rows ?? "—"} · symbols ${dataBundle.edgeboard.visible_symbols ?? "—"} · positive ${dataBundle.edgeboard.positive_edge_symbols ?? "—"} · source ${dataBundle.edgeboard.source_db ?? "—"}`
              : isNl
                ? "Nog geen zichtbare edgeboard snapshot."
                : "No visible edgeboard snapshot yet."}
          </p>
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
                    {["#", "Symbol", "Route", "Edge", "Conf", "Reason"].map((h) => (
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

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Why-No-Trade / Rejections</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            <strong>{isNl ? "Stage: " : "Stage: "}</strong>
            {row(dataBundle?.route_no_trade?.funnel_stage_counts_24h)}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            <strong>{isNl ? "Decision codes: " : "Decision codes: "}</strong>
            {row(dataBundle?.route_no_trade?.funnel_decision_code_counts_24h)}
          </p>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Position Context Board</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            Safety: N={safety?.safety_normal_count ?? "—"} · E={safety?.safety_exit_only_count ?? "—"} · B={safety?.safety_hard_blocked_count ?? "—"}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Path doctrine: " : "Path doctrine: "}
            {row(dataBundle?.path_doctrine?.orders_by_path_tape_24h)}
          </p>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Timing & Execution Viability</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            submit→ack avg: {latency?.submit_to_ack_ms_avg != null ? `${Math.round(latency.submit_to_ack_ms_avg)} ms` : "—"} · n={latency?.sample_count ?? "—"}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            orders 24h: {execution?.orders_24h_count ?? "—"} · fills 24h: {execution?.fills_24h_count ?? "—"}
          </p>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Strategy / Regime Matrix</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Aanname op basis van route/context snapshots; geen realtime signaalfeed." : "Derived from route/context snapshots; not a realtime signal feed."}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Edgeboard model: " : "Edgeboard model: "}
            {dataBundle?.edgeboard?.model_version ?? "—"}
          </p>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Execution / Fill Quality</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            order status: {row(execution?.orders_status_counts_24h)}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            fill side: {row(execution?.fills_side_counts_24h)}
          </p>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Runtime Health</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Run health samples: " : "Run health samples: "}
            {execution?.run_health_timeline?.length ?? 0}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Infra/watchdog: " : "Infra/watchdog: "}
            {dataBundle?.infra?.latest_watchdog_state ?? "—"}
          </p>
        </section>

        <section className="card" style={{ margin: 0, minWidth: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Route Drilldown / Lineage</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl
              ? "Publieke drilldown blijft geaggregeerd. Voor canonieke definities: SPEC + docs."
              : "Public drilldown remains aggregated. For canonical definitions: SPEC + docs."}
          </p>
          <p style={{ margin: "0.45rem 0 0", fontSize: "0.88rem" }}>
            <Link href={withLocale(locale, "/spec")} className="kb-text-link">SPEC</Link>
            {" · "}
            <Link href={withLocale(locale, "/docs")} className="kb-text-link">
              {isNl ? "Publieke docs" : "Public docs"}
            </Link>
          </p>
        </section>

        {pnl ? (
          <section className="card" style={{ margin: 0, minWidth: 0 }}>
            <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>
              {isNl ? "Economische context (publiek geaggregeerd)" : "Economic context (public aggregated)"}
            </h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
              realized_pnl_quote_24h: {pnl.realized_pnl_quote_24h != null ? pnl.realized_pnl_quote_24h.toFixed(2) : "—"} · drawdown:{" "}
              {pnl.drawdown_pct != null ? `${pnl.drawdown_pct.toFixed(2)}%` : "—"}
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
