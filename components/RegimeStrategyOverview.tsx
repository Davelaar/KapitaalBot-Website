import type {
  PublicRegimeSnapshot,
  PublicStrategySnapshot,
} from "@/lib/snapshots";

export interface RegimeStrategyOverviewProps {
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
}

export function RegimeStrategyOverview({
  regime,
  strategy,
}: RegimeStrategyOverviewProps) {
  const hasRegime = regime?.active_regimes?.length;
  const hasStrategy = strategy?.active_strategies?.length;

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
            Regimes (24h)
          </h3>
          {hasRegime ? (
            <>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  lineHeight: 1.6,
                }}
              >
                {regime!.active_regimes.map((r) => (
                  <li key={r.regime}>
                    <strong>{r.regime}</strong>: {r.count}
                  </li>
                ))}
              </ul>
              {regime!.dominant_regime && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    color: "var(--muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  Dominant: {regime!.dominant_regime}
                </p>
              )}
            </>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>Geen data</p>
          )}
        </div>
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
            Strategies (24h)
          </h3>
          {hasStrategy ? (
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              {strategy!.active_strategies.map((s) => (
                <li key={s.strategy}>
                  <strong>{s.strategy}</strong>: {s.count}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>Geen data</p>
          )}
        </div>
      </div>
    </section>
  );
}
