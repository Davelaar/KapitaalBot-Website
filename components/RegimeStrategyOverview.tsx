import { getPublicRegimeSnapshot } from "@/lib/read-snapshots";
import { getPublicStrategySnapshot } from "@/lib/read-snapshots";

export async function RegimeStrategyOverview() {
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Regime & strategy (Tier 1)
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="card">
          <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Regimes (24h)
          </h3>
          {regime?.active_regimes?.length ? (
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {regime.active_regimes.map((r) => (
                <li key={r.regime}>
                  {r.regime}: {r.count}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ color: "var(--muted)" }}>Geen data</span>
          )}
          {regime?.dominant_regime && (
            <p style={{ marginTop: "0.5rem", color: "var(--muted)", fontSize: "0.875rem" }}>
              Dominant: {regime.dominant_regime}
            </p>
          )}
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Strategies (24h)
          </h3>
          {strategy?.active_strategies?.length ? (
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {strategy.active_strategies.map((s) => (
                <li key={s.strategy}>
                  {s.strategy}: {s.count}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ color: "var(--muted)" }}>Geen data</span>
          )}
        </div>
      </div>
    </section>
  );
}
