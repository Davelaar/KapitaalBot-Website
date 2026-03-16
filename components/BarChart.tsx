"use client";

export interface BarChartItem {
  label: string;
  value: number;
}

export interface BarChartProps {
  title: string;
  items: BarChartItem[];
  maxBarWidthPx?: number;
  accentColor?: string;
}

export default function BarChart({
  title,
  items,
  maxBarWidthPx = 200,
  accentColor = "var(--accent)",
}: BarChartProps) {
  const total = items.reduce((s, x) => s + x.value, 0);
  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div
      className="card"
      style={{
        padding: "1rem 1.25rem",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          marginBottom: "0.75rem",
          color: "var(--fg)",
        }}
      >
        {title}
      </h3>
      {items.length === 0 ? (
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.875rem" }}>
          No data
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {items.map((item) => {
            const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
            const widthPx = Math.round((pct / 100) * maxBarWidthPx);
            return (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) auto auto",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--fg)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.label}
                >
                  {item.label}
                </span>
                <div
                  style={{
                    width: maxBarWidthPx,
                    height: 20,
                    background: "var(--border)",
                    borderRadius: 4,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      minWidth: item.value > 0 ? 4 : 0,
                      background: accentColor,
                      borderRadius: 4,
                    }}
                    title={`${item.label}: ${item.value}`}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    minWidth: 2.5eem,
                    textAlign: "right",
                  }}
                >
                  {item.value}
                  {total > 0 && (
                    <span style={{ fontWeight: 400, color: "var(--muted)", opacity: 0.8 }}>
                      {" "}
                      ({Math.round((item.value / total) * 100)}%)
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
