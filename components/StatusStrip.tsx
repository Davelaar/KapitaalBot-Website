import type { PublicStatusSnapshot } from "@/lib/snapshots";

export interface StatusStripProps {
  status: PublicStatusSnapshot | null;
}

export function StatusStrip({ status }: StatusStripProps) {
  if (!status) {
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
          Geen snapshot beschikbaar. Start de bot export of controleer{" "}
          <code style={{ fontSize: "0.875em" }}>OBSERVABILITY_EXPORT_DIR</code>.
        </p>
      </div>
    );
  }

  const freshness =
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
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Data freshness
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          {freshness}
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
