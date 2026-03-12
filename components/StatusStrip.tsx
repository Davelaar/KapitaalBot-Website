import { getPublicStatusSnapshot } from "@/lib/read-snapshots";

export async function StatusStrip() {
  const status = getPublicStatusSnapshot();
  if (!status) {
    return (
      <div className="card" style={{ marginBottom: "1rem" }}>
        <span style={{ color: "var(--muted)" }}>
          Geen snapshot beschikbaar. Start de bot export of controleer
          OBSERVABILITY_EXPORT_DIR.
        </span>
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
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <span>
        <strong>Run</strong> #{status.run_id ?? "—"}
      </span>
      <span>
        <strong>Epoch</strong> {status.epoch_status ?? "—"} (
        {status.epoch_symbol_count ?? 0} symbols)
      </span>
      <span>
        <strong>Data freshness</strong> {freshness}
      </span>
      <span>
        <strong>Snapshot</strong> {status.exported_at}
      </span>
    </div>
  );
}
