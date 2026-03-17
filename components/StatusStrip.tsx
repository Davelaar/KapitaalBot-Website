import type { PublicStatusSnapshot } from "@/lib/snapshots";
import { getFreshnessInfo, formatDelaySeconds } from "@/lib/snapshot-freshness";
import { t, type Locale } from "@/lib/i18n";

export interface StatusStripProps {
  status: PublicStatusSnapshot | null;
  locale?: Locale;
}

function StatusStripSkeleton({ locale = "nl" }: { locale?: Locale }) {
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
        {t(locale, "status.awaiting")}
      </p>
      <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", fontSize: "0.8125rem" }}>
        Configure <code style={{ fontSize: "0.875em" }}>OBSERVABILITY_EXPORT_DIR</code> and run the bot snapshot export.
      </p>
    </div>
  );
}

export default function StatusStrip({ status, locale = "nl" }: StatusStripProps) {
  if (!status) {
    return <StatusStripSkeleton locale={locale} />;
  }

  const freshnessInfo = getFreshnessInfo(status.data_freshness_secs);
  const freshnessSecs =
    status.data_freshness_secs != null
      ? `${status.data_freshness_secs}s`
      : "—";
  const delayLabel =
    status.data_freshness_secs != null
      ? formatDelaySeconds(status.data_freshness_secs)
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
          {t(locale, "status.run")}
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--accent)" }}>
          #{status.run_id ?? "—"}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          {t(locale, "status.epoch")}
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
          {t(locale, "status.freshnessLabel")}
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
          {delayLabel} ({freshnessSecs})
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          {t(locale, "status.snapshot")}
        </div>
        <div style={{ fontSize: "0.8125rem", fontFamily: "monospace" }}>
          {status.exported_at}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          {t(locale, "status.safety")}
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
