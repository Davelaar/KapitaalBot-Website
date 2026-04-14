"use client";

import { sortedLabelCounts } from "@/lib/label-count-utils";
import type { LabelCount } from "@/lib/snapshots";

export function LabelCountBarTable({
  rows,
  emptyLabel,
  maxRows = 14,
  accentColor = "var(--brand)",
  showPct = true,
  caption,
}: {
  rows: LabelCount[] | null | undefined;
  emptyLabel: string;
  maxRows?: number;
  accentColor?: string;
  /** Show share of displayed rows (not full population if truncated). */
  showPct?: boolean;
  caption?: string;
}) {
  const sorted = sortedLabelCounts(rows).slice(0, maxRows);
  const max = Math.max(...sorted.map((r) => r.count), 1);
  const displayedTotal = sorted.reduce((s, r) => s + r.count, 0);

  if (sorted.length === 0) {
    return <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>{emptyLabel}</p>;
  }

  return (
    <div className="kb-bar-table-wrap">
      {caption ? (
        <p className="kb-bar-table-caption" style={{ margin: "0 0 0.35rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
          {caption}
        </p>
      ) : null}
      <table className="kb-table kb-bar-table" role="table" style={{ fontSize: "0.8rem", width: "100%" }}>
        <tbody>
          {sorted.map((r, i) => {
            const pctBar = max > 0 ? (r.count / max) * 100 : 0;
            const pctOfShown = displayedTotal > 0 ? (r.count / displayedTotal) * 100 : 0;
            return (
              <tr key={`${r.label}-${i}`}>
                <td className="kb-bar-table__label" title={r.label}>
                  {r.label}
                </td>
                <td className="kb-bar-table__bar">
                  <div className="kb-bar-table__track" aria-hidden>
                    <div
                      className="kb-bar-table__fill"
                      style={{
                        width: `${pctBar}%`,
                        background: accentColor,
                      }}
                    />
                  </div>
                </td>
                <td className="kb-bar-table__num">
                  {r.count.toLocaleString()}
                  {showPct ? (
                    <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: "0.35rem" }}>
                      ({Math.round(pctOfShown)}%)
                    </span>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
