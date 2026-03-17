/**
 * Snapshot freshness levels for observability UI.
 * <60s GOOD (green), 60-300s WARN (orange), >300s STALE (red).
 */

export type FreshnessLevel = "good" | "warn" | "stale" | "unknown";

/** Format delay in seconds as human-readable (e.g. "45 s", "2 min", "1 h"). */
export function formatDelaySeconds(secs: number): string {
  if (secs < 60) return `${secs} s`;
  if (secs < 3600) return `${Math.round(secs / 60)} min`;
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export interface FreshnessInfo {
  level: FreshnessLevel;
  label: string;
  color: string;
  tooltip: string;
}

export function getFreshnessInfo(dataFreshnessSecs: number | null): FreshnessInfo {
  if (dataFreshnessSecs == null) {
    return {
      level: "unknown",
      label: "—",
      color: "var(--muted)",
      tooltip: "Data freshness not available.",
    };
  }
  if (dataFreshnessSecs < 60) {
    return {
      level: "good",
      label: "GOOD",
      color: "var(--freshness-good, #2ea043)",
      tooltip: `Data is fresh (< 60s). Last update ${dataFreshnessSecs}s ago.`,
    };
  }
  if (dataFreshnessSecs <= 300) {
    return {
      level: "warn",
      label: "WARN",
      color: "var(--freshness-warn, #d4a72c)",
      tooltip: `Data is delayed (60–300s). Last update ${dataFreshnessSecs}s ago.`,
    };
  }
  return {
    level: "stale",
    label: "STALE",
    color: "var(--freshness-stale, #da3633)",
    tooltip: `Data may be stale (> 300s). Last update ${dataFreshnessSecs}s ago.`,
  };
}
