import type {
  Tier2DataBundle,
  Tier2EdgeboardCandidateRow,
  Tier2EdgeboardRouteRow,
  Tier2EdgeboardSection,
  Tier2EdgeboardSignalRow,
} from "@/lib/snapshots";

interface DashboardTier2EdgeboardContentProps {
  dataBundle: Tier2DataBundle | null;
}

function fmtNum(v: number | null | undefined, digits = 2): string {
  if (v == null || Number.isNaN(v)) return "—";
  return v.toFixed(digits);
}

function fmtInt(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "—";
  return Math.round(v).toString();
}

function fmtTs(v: string | null | undefined): string {
  if (!v) return "—";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return v;
  return dt.toLocaleString();
}

function fmtJson(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return "{}";
  }
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ minHeight: "76px", padding: "0.75rem 0.9rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{label}</span>
      <strong style={{ fontSize: "0.98rem", color: "var(--fg)" }}>{value}</strong>
    </div>
  );
}

function PrecheckSection() {
  return (
    <section className="card" style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>DB Target Precheck</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.84rem", marginTop: 0 }}>
        Operationele target-check voor de Edgeboard weergave. Canoniek gebruikt: <strong>RESEARCH</strong>.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.6rem" }}>
        <StatCard label="INGEST env" value="INGEST_DATABASE_URL" />
        <StatCard label="INGEST db" value="derived: ingest role" />
        <StatCard label="INGEST host:port" value="derived: runtime config" />
        <StatCard label="DECISION env" value="DECISION_DATABASE_URL" />
        <StatCard label="DECISION db" value="derived: decision role" />
        <StatCard label="DECISION host:port" value="derived: runtime config" />
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 0, marginTop: "0.65rem" }}>
        Waarom: edgeboard kolommen + eerste rijdata opvragen en operationeel presenteren.
      </p>
    </section>
  );
}

function EdgeboardMetaSection({ edgeboard }: { edgeboard: Tier2EdgeboardSection }) {
  return (
    <section className="card" style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Edgeboard Meta</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.83rem", marginTop: 0 }}>
        Samenvatting van de laatste edgeboard-run met snapshot- en modelcontext.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem" }}>
        <StatCard label="snapshot_ts" value={fmtTs(edgeboard.snapshot_ts)} />
        <StatCard label="symbols_seen" value={fmtInt(edgeboard.visible_symbols)} />
        <StatCard label="rows_scored" value={fmtInt(edgeboard.visible_rows)} />
        <StatCard label="rows_ranked" value={fmtInt((edgeboard.top_signals || []).length)} />
        <StatCard label="model_version" value={edgeboard.model_version ?? "—"} />
        <StatCard label="training_window_start" value="—" />
        <StatCard label="training_window_end" value="—" />
        <StatCard label="created_at" value={fmtTs(edgeboard.snapshot_ts)} />
      </div>
    </section>
  );
}

function tableWrap(children: React.ReactNode) {
  return <div style={{ overflowX: "auto", borderRadius: "8px" }}>{children}</div>;
}

const TABLE = { width: "100%", borderCollapse: "collapse" as const, fontSize: "0.8rem" };
const TH = {
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
  padding: "0.45rem 0.5rem",
  borderBottom: "1px solid var(--border)",
  color: "var(--muted)",
  fontWeight: 600,
};
const TD = {
  whiteSpace: "nowrap" as const,
  padding: "0.42rem 0.5rem",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "top" as const,
};

function renderJsonCell(value: unknown) {
  return (
    <details>
      <summary style={{ cursor: "pointer" }}>JSON</summary>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap", maxWidth: "360px" }}>{fmtJson(value)}</pre>
    </details>
  );
}

function SnapshotsSection({ rows, snapshotTs, modelVersion }: { rows: Tier2EdgeboardSignalRow[]; snapshotTs?: string | null; modelVersion?: string | null }) {
  const headers = [
    "rank","symbol","route_name","expected_net_edge_bps","expected_gross_move_bps","expected_cost_bps","confidence","freshness_ms","feature_coverage_class","dominant_reason_code","fallback_tier","delay_until","expires_at","snapshot_ts","state_signal_ts","state_computed_at","model_version","label_column","feature_version","explainability_json","created_at",
  ];
  return (
    <section className="card" style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Ranked Snapshots</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.83rem", marginTop: 0 }}>
        Gerankte snapshot-rijen met edge, confidence en freshness.
      </p>
      {tableWrap(
        <table style={TABLE}>
          <thead><tr>{headers.map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.slice(0, 500).map((r, idx) => (
              <tr key={r.symbol + "-" + r.route_name + "-" + String(idx)}>
                <td style={{ ...TD, fontWeight: 700 }}>{r.rank}</td>
                <td style={TD}>{r.symbol}</td>
                <td style={TD}>{r.route_name}</td>
                <td style={TD}>{fmtNum(r.expected_net_edge_bps, 2)}</td>
                <td style={TD}>{fmtNum(r.expected_gross_move_bps, 2)}</td>
                <td style={TD}>{fmtNum(r.expected_cost_bps, 2)}</td>
                <td style={TD}>{fmtNum(r.confidence, 2)}</td>
                <td style={TD}>{fmtInt(r.freshness_ms)}</td>
                <td style={TD}>{r.feature_coverage_class ?? "—"}</td>
                <td style={TD}>{r.dominant_reason_code ?? "—"}</td>
                <td style={TD}>—</td>
                <td style={TD}>—</td>
                <td style={TD}>—</td>
                <td style={TD}>{fmtTs(snapshotTs)}</td>
                <td style={TD}>—</td>
                <td style={TD}>—</td>
                <td style={TD}>{modelVersion ?? "—"}</td>
                <td style={TD}>{"ret_" + String(Math.round(r.horizon_sec / 60)) + "m_bps"}</td>
                <td style={TD}>—</td>
                <td style={TD}>{renderJsonCell({ boost: r.boost, sample_size: r.sample_size })}</td>
                <td style={TD}>{fmtTs(snapshotTs)}</td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}
    </section>
  );
}

function flattenCandidates(rows: Tier2EdgeboardCandidateRow[] | undefined) {
  const out: Array<Tier2EdgeboardRouteRow & { symbol: string }> = [];
  for (const c of rows ?? []) for (const r of c.routes ?? []) out.push({ ...r, symbol: c.symbol });
  return out;
}

function CandidatesSection({ edgeboard }: { edgeboard: Tier2EdgeboardSection }) {
  const rows = flattenCandidates(edgeboard.candidates);
  const headers = [
    "snapshot_ts","symbol","route_name","horizon_sec","expected_gross_move_bps","expected_cost_bps","expected_net_edge_bps","confidence","sample_size","variance_bps","freshness_ms","feature_coverage_class","dominant_reason_code","fallback_tier","state_signal_ts","state_computed_at","feature_version","label_column","model_version","explainability_json","created_at",
  ];
  return (
    <section className="card" style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Candidates</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.83rem", marginTop: 0 }}>
        Candidate-rijen per symbool en route met horizon-specifieke expected edge.
      </p>
      {tableWrap(
        <table style={TABLE}>
          <thead><tr>{headers.map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.slice(0, 500).map((r, idx) => (
              <tr key={r.symbol + "-" + r.route_name + "-" + String(idx)}>
                <td style={TD}>{fmtTs(edgeboard.snapshot_ts)}</td>
                <td style={TD}>{r.symbol}</td>
                <td style={TD}>{r.route_name}</td>
                <td style={TD}>{fmtInt(r.horizon_sec)}</td>
                <td style={TD}>{fmtNum(r.expected_gross_move_bps, 2)}</td>
                <td style={TD}>{fmtNum(r.expected_cost_bps, 2)}</td>
                <td style={TD}>{fmtNum(r.expected_net_edge_bps, 2)}</td>
                <td style={TD}>{fmtNum(r.confidence, 2)}</td>
                <td style={TD}>{fmtInt(r.sample_size)}</td>
                <td style={TD}>—</td>
                <td style={TD}>{fmtInt(r.freshness_ms)}</td>
                <td style={TD}>{r.feature_coverage_class ?? "—"}</td>
                <td style={TD}>{r.dominant_reason_code ?? "—"}</td>
                <td style={TD}>—</td>
                <td style={TD}>—</td>
                <td style={TD}>—</td>
                <td style={TD}>—</td>
                <td style={TD}>{"ret_" + String(Math.round(r.horizon_sec / 60)) + "m_bps"}</td>
                <td style={TD}>{edgeboard.model_version ?? "—"}</td>
                <td style={TD}>{renderJsonCell({ confidence: r.confidence, boost: r.boost })}</td>
                <td style={TD}>{fmtTs(edgeboard.snapshot_ts)}</td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}
    </section>
  );
}

function TrainingExamplesSection({ edgeboard }: { edgeboard: Tier2EdgeboardSection }) {
  const headers = [
    "id","source","source_row_key","symbol","feature_ts","ret_5m_bps","spread_bps","orderbook_imbalance","trade_flow_imbalance","realized_vol_1m_bps","microprice_deviation_bps","avg_estimated_fill_time_bid_ms","avg_refill_rate_bid","avg_cancel_rate_bid","avg_queue_turnover_bid","source_confidence","explainability_json","created_at",
  ];
  return (
    <section className="card" style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1.05rem", marginBottom: "0.45rem" }}>Training Examples</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.83rem", marginTop: 0 }}>
        Trainingsfeatures zijn nog niet als rijset aanwezig in tier2_data_bundle; teller: {fmtInt(edgeboard.training_examples_24h)}.
      </p>
      {tableWrap(
        <table style={TABLE}>
          <thead><tr>{headers.map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            <tr>
              <td style={TD}>—</td><td style={TD}>not_exported_in_tier2_bundle</td><td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td>
              <td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td>
              <td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td><td style={TD}>—</td>
              <td style={TD}>—</td><td style={TD}>{renderJsonCell({ note: "training_examples rows not exported yet" })}</td><td style={TD}>{fmtTs(edgeboard.snapshot_ts)}</td>
            </tr>
          </tbody>
        </table>,
      )}
    </section>
  );
}

export function DashboardTier2EdgeboardContent({ dataBundle }: DashboardTier2EdgeboardContentProps) {
  const edgeboard = dataBundle?.edgeboard;
  return (
    <main style={{ padding: "1rem", maxWidth: "1600px", margin: "0 auto" }}>
      <section className="card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--accent)" }}>
        <h1 style={{ fontSize: "1.35rem", marginBottom: "0.35rem" }}>Edgeboard</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 0 }}>
          Deze pagina toont actuele edgeboard data uit de operationele research-context: metadata, ranked snapshots, candidates en training-context.
          Focus: ranking, expected edge, confidence, freshness en modelcontext.
        </p>
        <ul style={{ marginTop: "0.35rem", marginBottom: "0.25rem", color: "var(--muted)", fontSize: "0.83rem" }}>
          <li>DB target precheck</li>
          <li>edgeboard meta</li>
          <li>ranked snapshots</li>
          <li>candidates</li>
          <li>training examples</li>
        </ul>
      </section>

      <PrecheckSection />

      {!edgeboard ? (
        <section className="card"><h2 style={{ fontSize: "1.05rem" }}>Geen edgeboard data</h2><p style={{ color: "var(--muted)", marginBottom: 0 }}>tier2_data_bundle.json bevat nog geen edgeboard sectie.</p></section>
      ) : (
        <>
          <EdgeboardMetaSection edgeboard={edgeboard} />
          <SnapshotsSection rows={edgeboard.top_signals ?? []} snapshotTs={edgeboard.snapshot_ts} modelVersion={edgeboard.model_version} />
          <CandidatesSection edgeboard={edgeboard} />
          <TrainingExamplesSection edgeboard={edgeboard} />
        </>
      )}
    </main>
  );
}
