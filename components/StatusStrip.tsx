import type { PublicStatusSnapshot } from "@/lib/snapshots";
import { getFreshnessInfo } from "@/lib/snapshot-freshness";

export interface StatusStripProps {
  status: PublicStatusSnapshot | null;
}

function StatusStripSkeleton() {
  return (
    <div
      className="card"
      style={{
        marginBottom: "1rem",
        padding: "1rem 1.25rem",
        borderLeft: "4px solid var(--muted)",
      }}
    >
      <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9375rem" }}>
        Awaiting bot export…
      </p>
      <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", fontSize: "0.8125rem" }}>
        Configure <code style={{ fontSize: "0.875em" }}>OBSERVABILITY_EXPORT_DIR</code> and run the bot snapshot export.
      </p>
    </div>
  );
}

export default function StatusStrip({ status }: StatusStripProps) {
  if (!status) {
    return <StatusStripSkeleton />;
  }

  const freshnessInfo = getFreshnessInfo(status.data_freshness_secs);
  const freshnessSecs =
    status.data_freshness_secs != null
      ? `${status.data_freshness_secs}s`
      : "—";

  return (
    <div
      className="card"
      style={{
        marginBottom: "1rem",
        padding: "1rem 1.25rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Run
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--accent)" }}>
          #{status.run_id ?? "—"}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Epoch
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          {status.epoch_status ?? "—"}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
          {status.epoch_symbol_count ?? 0} symbols
        </div>
      </div>
      <div
        title={freshnessInfo.tooltip}
        style={{ cursor: "help" }}
      >
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Freshness
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: freshnessInfo.color,
          }}
        >
          {freshnessInfo.label}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
          {freshnessSecs}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Snapshot
        </div>
        <div style={{ fontSize: "0.8125rem", fontFamily: "monospace" }}>
          {status.exported_at}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Safety
        </div>
        <div style={{ fontSize: "0.8125rem" }}>
          <span title="Normal">N:{status.safety_normal_count}</span>
          {" · "}
          <span title="Exit only">E:{status.safety_exit_only_count}</span>
          {" · "}
          <span title="Hard blocked">B:{status.safety_hard_blocked_count}</span>
        </div>
      </div>
    </div>
  );
}
