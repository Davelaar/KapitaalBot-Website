"use client";

/** Thick ring gauge — cockpit instrument, not a soft chart. */
export function InstrumentGauge({
  size = 124,
  stroke = 12,
  pct,
  centerPrimary,
  centerSecondary,
  footnote,
}: {
  size?: number;
  stroke?: number;
  pct: number;
  centerPrimary: string;
  centerSecondary?: string;
  footnote?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  const dash = (p / 100) * c;
  const gap = c - dash;

  return (
    <div className="cockpit-gauge" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="cockpit-gauge__svg">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#2d3a52"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            className="cockpit-gauge__arc"
          />
        </g>
        <text
          x="50%"
          y={centerSecondary ? "42%" : "50%"}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text)"
          style={{
            fontSize: centerPrimary.length > 5 ? 11 : 13,
            fontWeight: 650,
            letterSpacing: "-0.02em",
          }}
        >
          {centerPrimary}
        </text>
        {centerSecondary ? (
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-muted)"
            style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            {centerSecondary}
          </text>
        ) : null}
      </svg>
      {footnote ? <p className="cockpit-gauge__foot mono">{footnote}</p> : null}
    </div>
  );
}
