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

function pieWedgePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${end.x} ${end.y} A ${r} ${r} 0 ${large} 1 ${start.x} ${start.y} Z`;
}

/** Annulus sector — same angle convention as pie wedges. */
function donutSlicePath(cx: number, cy: number, rOut: number, rIn: number, startAngle: number, endAngle: number) {
  const pStartOut = polarToCartesian(cx, cy, rOut, startAngle);
  const pEndOut = polarToCartesian(cx, cy, rOut, endAngle);
  const pEndIn = polarToCartesian(cx, cy, rIn, endAngle);
  const pStartIn = polarToCartesian(cx, cy, rIn, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${pStartOut.x} ${pStartOut.y} A ${rOut} ${rOut} 0 ${largeArc} 1 ${pEndOut.x} ${pEndOut.y} L ${pEndIn.x} ${pEndIn.y} A ${rIn} ${rIn} 0 ${largeArc} 0 ${pStartIn.x} ${pStartIn.y} Z`;
}

export function SimplePieChart({
  title,
  segments,
  size = 160,
  className,
  variant = "pie",
  centerLabel,
}: {
  title?: string;
  segments: PieSegment[];
  size?: number;
  className?: string;
  /** Donut charts suit aggregate distributions (funnel, regime, etc.). */
  variant?: "pie" | "donut";
  /** Shown in donut hole (e.g. total count) — restraint: short text only. */
  centerLabel?: string;
}) {
  const positive = segments.filter((s) => s.value > 0);
  const sum = positive.reduce((a, s) => a + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const rOut = size * 0.38;
  const rIn = variant === "donut" ? size * 0.22 : 0;

  if (sum <= 0 || positive.length === 0) {
    return (
      <div className={className} style={{ minWidth: size }}>
        {title ? (
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{title}</p>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>—</p>
      </div>
    );
  }

  let angle = 0;
  const slices: { path: string; color: string; label: string; value: number; pct: number }[] = [];
  positive.forEach((s, i) => {
    const sweep = (s.value / sum) * 360;
    const start = angle;
    const end = angle + sweep;
    const path =
      variant === "donut"
        ? donutSlicePath(cx, cy, rOut, rIn, start, end)
        : pieWedgePath(cx, cy, rOut, start, end);
    slices.push({
      path,
      color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      label: s.label,
      value: s.value,
      pct: (s.value / sum) * 100,
    });
    angle = end;
  });

  const label = `${title ?? "distribution"}: ${positive.map((s) => `${s.label} ${((s.value / sum) * 100).toFixed(0)}%`).join(", ")}`;

  const centerFont = Math.max(11, Math.round(size * 0.1));

  return (
    <div className={className} style={{ minWidth: size }} role="img" aria-label={label}>
      {title ? (
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{title}</p>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-start" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 } as CSSProperties}>
          {slices.map((sl, idx) => (
            <path key={idx} d={sl.path} fill={sl.color} stroke="var(--border-strong)" strokeWidth={0.5} />
          ))}
          {variant === "donut" && centerLabel ? (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-secondary)"
              style={{ fontSize: centerFont, fontWeight: 650, letterSpacing: "-0.02em" }}
            >
              {centerLabel}
            </text>
          ) : null}
        </svg>
        <ul
          style={{
            margin: 0,
            padding: "0 0 0 1rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            listStyle: "disc",
            maxWidth: "14rem",
          }}
        >
          {slices.map((sl, idx) => (
            <li key={idx} style={{ marginBottom: "0.2rem" }}>
              <span style={{ color: sl.color, fontWeight: 600 }}>●</span> {sl.label}{" "}
              <span style={{ color: "var(--text)" }}>
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

export function pieSegmentsTotal(segments: PieSegment[]): number {
  return segments.reduce((a, s) => a + (s.value > 0 ? s.value : 0), 0);
}
