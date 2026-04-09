import type { PublicRegimeSnapshot, PublicStrategySnapshot } from "@/lib/snapshots";

export interface RegimeStrategyOverviewProps {
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
}

export default function RegimeStrategyOverview({ regime, strategy }: RegimeStrategyOverviewProps) {
  const regimes = regime?.active_regimes ?? [];
  const strategies = strategy?.active_strategies ?? [];

  if (regimes.length === 0 && strategies.length === 0) return null;

  return (
    <section style={{ marginTop: "1.5rem" }} className="card">
      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Strategy / Regime matrix snapshot</h2>
      <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.875rem" }}>
        Aggregated decision-context distribution. This panel is descriptive and non-reproducible by design.
      </p>
      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "0.98rem", marginBottom: "0.5rem" }}>Regimes</h3>
          <ul style={{ margin: 0, paddingLeft: "1rem", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
            {regimes.map((r) => (
              <li key={r.regime}>
                {r.regime}: {r.count}
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "0.98rem", marginBottom: "0.5rem" }}>Strategies</h3>
          <ul style={{ margin: 0, paddingLeft: "1rem", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
            {strategies.map((s) => (
              <li key={s.strategy}>
                {s.strategy}: {s.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {regime?.dominant_regime && (
        <p style={{ marginTop: "0.75rem", marginBottom: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
          Dominant regime: <strong style={{ color: "var(--fg)" }}>{regime.dominant_regime}</strong>
        </p>
      )}
    </section>
  );
}
