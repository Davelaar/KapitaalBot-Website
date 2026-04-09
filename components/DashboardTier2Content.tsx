"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
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
          <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← {isNl ? "Dashboard" : "Dashboard"}
          </Link>
        </nav>
        <section className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
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
        <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {isNl ? "Dashboard" : "Dashboard"}
        </Link>
      </nav>

      <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>
        {isNl ? "Tier 2: route-/decision-centric observability" : "Tier 2: route/decision-centric observability"}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem", maxWidth: "78ch", lineHeight: 1.65 }}>
        {isNl
          ? "Verdiepte operationele diagnose op basis van geaggregeerde snapshots. Deze pagina toont uitkomst- en oorzaakinformatie zonder broncode, zonder private accountdetails en zonder reproduceerbare tuning."
          : "Deep operational diagnostics from aggregated snapshots. This page shows outcomes and causes without source code, without private account details, and without reproducible tuning."}
      </p>

      {dataBundle && (
        <section className="card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--accent)" }}>
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

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))" }}>
        <section className="card" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Live Route Board</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {dataBundle?.edgeboard?.available
              ? `Edgeboard: rows ${dataBundle.edgeboard.visible_rows ?? "—"} · symbols ${dataBundle.edgeboard.visible_symbols ?? "—"} · positive ${dataBundle.edgeboard.positive_edge_symbols ?? "—"}`
              : isNl
                ? "Nog geen zichtbare edgeboard snapshot."
                : "No visible edgeboard snapshot yet."}
          </p>
          {dataBundle?.edgeboard?.top_signals?.length ? (
            <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
              {dataBundle.edgeboard.top_signals
                .slice(0, 5)
                .map((s) => `${s.symbol}/${s.route_name} (${s.expected_net_edge_bps.toFixed(1)}bps)`)
                .join(" · ")}
            </p>
          ) : null}
        </section>

        <section className="card" style={{ margin: 0 }}>
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

        <section className="card" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Position Context Board</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            Safety: N={safety?.safety_normal_count ?? "—"} · E={safety?.safety_exit_only_count ?? "—"} · B={safety?.safety_hard_blocked_count ?? "—"}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Path doctrine: " : "Path doctrine: "}
            {row(dataBundle?.path_doctrine?.orders_by_path_tape_24h)}
          </p>
        </section>

        <section className="card" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Timing & Execution Viability</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            submit→ack avg: {latency?.submit_to_ack_ms_avg != null ? `${Math.round(latency.submit_to_ack_ms_avg)} ms` : "—"} · n={latency?.sample_count ?? "—"}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            orders 24h: {execution?.orders_24h_count ?? "—"} · fills 24h: {execution?.fills_24h_count ?? "—"}
          </p>
        </section>

        <section className="card" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Strategy / Regime Matrix</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Aanname op basis van route/context snapshots; geen realtime signaalfeed." : "Derived from route/context snapshots; not a realtime signal feed."}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl ? "Edgeboard model: " : "Edgeboard model: "}
            {dataBundle?.edgeboard?.model_version ?? "—"}
          </p>
        </section>

        <section className="card" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Execution / Fill Quality</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            order status: {row(execution?.orders_status_counts_24h)}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            fill side: {row(execution?.fills_side_counts_24h)}
          </p>
        </section>

        <section className="card" style={{ margin: 0 }}>
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

        <section className="card" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Route Drilldown / Lineage</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            {isNl
              ? "Publieke drilldown blijft geaggregeerd. Voor canonieke definities: SPEC + docs."
              : "Public drilldown remains aggregated. For canonical definitions: SPEC + docs."}
          </p>
          <p style={{ margin: "0.45rem 0 0", fontSize: "0.88rem" }}>
            <Link href={withLocale(locale, "/spec")} style={{ color: "var(--accent)", textDecoration: "none" }}>SPEC</Link>
            {" · "}
            <Link href={withLocale(locale, "/docs")} style={{ color: "var(--accent)", textDecoration: "none" }}>
              {isNl ? "Publieke docs" : "Public docs"}
            </Link>
          </p>
        </section>
      </div>

      {pnl ? (
        <section className="card" style={{ marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>
            {isNl ? "Economische context (publiek geaggregeerd)" : "Economic context (public aggregated)"}
          </h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
            realized_pnl_quote_24h: {pnl.realized_pnl_quote_24h != null ? pnl.realized_pnl_quote_24h.toFixed(2) : "—"} · drawdown:{" "}
            {pnl.drawdown_pct != null ? `${pnl.drawdown_pct.toFixed(2)}%` : "—"}
          </p>
        </section>
      ) : null}
    </main>
  );
}
