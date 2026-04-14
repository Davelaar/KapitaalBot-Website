"use client";

import { sortedLabelCounts } from "@/lib/label-count-utils";
import type { LabelCount } from "@/lib/snapshots";

export function LabelCountTable({
  rows,
  emptyLabel,
  maxRows = 12,
}: {
  rows: LabelCount[] | null | undefined;
  emptyLabel: string;
  maxRows?: number;
}) {
  const sorted = sortedLabelCounts(rows).slice(0, maxRows);
  if (sorted.length === 0) {
    return <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>{emptyLabel}</p>;
  }
  return (
    <table className="kb-table" style={{ fontSize: "0.8rem", width: "100%", marginTop: "0.35rem" }}>
      <tbody>
        {sorted.map((r, i) => (
          <tr key={`${r.label}-${i}`}>
            <td style={{ padding: "0.2rem 0.35rem 0.2rem 0", borderBottom: "1px solid var(--border)", wordBreak: "break-word" }}>
              {r.label}
            </td>
            <td style={{ padding: "0.2rem 0", borderBottom: "1px solid var(--border)", textAlign: "right", whiteSpace: "nowrap" }}>
              {r.count.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
