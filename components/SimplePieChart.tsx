"use client";

import type { CSSProperties } from "react";

export type PieSegment = { label: string; value: number; color?: string };

const DEFAULT_COLORS = [
  "var(--pie-1)",
  "var(--pie-2)",
  "var(--pie-3)",
  "var(--pie-4)",
  "var(--pie-5)",
  "var(--pie-6)",
  "var(--pie-7)",
  "var(--pie-8)",
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${end.x} ${end.y} A ${r} ${r} 0 ${large} 1 ${start.x} ${start.y} Z`;
}

export function SimplePieChart({
  title,
  segments,
  size = 160,
  className,
}: {
  title?: string;
  segments: PieSegment[];
  size?: number;
  className?: string;
}) {
  const positive = segments.filter((s) => s.value > 0);
  const sum = positive.reduce((a, s) => a + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  if (sum <= 0 || positive.length === 0) {
    return (
      <div className={className} style={{ minWidth: size }}>
        {title ? (
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--fg)" }}>{title}</p>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>—</p>
      </div>
    );
  }

  let angle = 0;
  const slices: { path: string; color: string; label: string; value: number; pct: number }[] = [];
  positive.forEach((s, i) => {
    const sweep = (s.value / sum) * 360;
    const start = angle;
    const end = angle + sweep;
    slices.push({
      path: arcPath(cx, cy, r, start, end),
      color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      label: s.label,
      value: s.value,
      pct: (s.value / sum) * 100,
    });
    angle = end;
  });

  const label = `${title ?? "distribution"}: ${positive.map((s) => `${s.label} ${((s.value / sum) * 100).toFixed(0)}%`).join(", ")}`;

  return (
    <div className={className} style={{ minWidth: size }} role="img" aria-label={label}>
      {title ? (
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--fg)" }}>{title}</p>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-start" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 } as CSSProperties}>
          {slices.map((sl, idx) => (
            <path key={idx} d={sl.path} fill={sl.color} stroke="var(--border)" strokeWidth={0.5} />
          ))}
        </svg>
        <ul
          style={{
            margin: 0,
            padding: "0 0 0 1rem",
            fontSize: "0.78rem",
            color: "var(--muted)",
            listStyle: "disc",
            maxWidth: "14rem",
          }}
        >
          {slices.map((sl, idx) => (
            <li key={idx} style={{ marginBottom: "0.2rem" }}>
              <span style={{ color: sl.color, fontWeight: 600 }}>●</span> {sl.label}{" "}
              <span style={{ color: "var(--fg)" }}>
                ({sl.pct.toFixed(0)}% · {sl.value.toLocaleString()})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function labelCountsToPieSegments(rows: { label: string; count: number }[] | null | undefined, maxSlices = 8): PieSegment[] {
  if (!rows?.length) return [];
  const sorted = [...rows].sort((a, b) => b.count - a.count);
  const head = sorted.slice(0, maxSlices - 1);
  const tail = sorted.slice(maxSlices - 1);
  const otherSum = tail.reduce((a, r) => a + r.count, 0);
  const out: PieSegment[] = head.map((r) => ({ label: r.label, value: r.count }));
  if (otherSum > 0) out.push({ label: "other", value: otherSum });
  return out;
}
