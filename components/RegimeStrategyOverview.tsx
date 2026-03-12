import type {
  PublicRegimeSnapshot,
  PublicStrategySnapshot,
} from "@/lib/snapshots";

export interface RegimeStrategyOverviewProps {
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
}

export default function RegimeStrategyOverview({
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
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: "var(--accent)",
                      color: "#0f1419",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    Dominant: {regime!.dominant_regime}
                  </span>
                </p>
              )}
              {hasRegime && regime!.active_regimes.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      height: 8,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "var(--border)",
                    }}
                  >
                    {regime!.active_regimes.map((r, i) => {
                      const total = regime!.active_regimes.reduce((s, x) => s + x.count, 0);
                      const pct = total > 0 ? (r.count / total) * 100 : 0;
                      return (
                        <div
                          key={r.regime}
                          style={{
                            width: `${pct}%`,
                            minWidth: pct > 0 ? 4 : 0,
                            background: "var(--accent)",
                            opacity: 0.7 + (i * 0.1),
                          }}
                          title={`${r.regime}: ${r.count}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "1rem 0", color: "var(--muted)", fontSize: "0.875rem" }}>
              Geen regime-data. Awaiting bot export…
            </div>
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
            <div style={{ padding: "1rem 0", color: "var(--muted)", fontSize: "0.875rem" }}>
              Geen strategy-data. Awaiting bot export…
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
