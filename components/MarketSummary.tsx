import type { PublicMarketSnapshot } from "@/lib/snapshots";

export interface MarketSummaryProps {
  market: PublicMarketSnapshot | null;
}

export function MarketSummary({ market }: MarketSummaryProps) {
  if (!market) {
    return (
      <section>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          Markt / pairs (Tier 1)
        </h2>
        <div
          className="card"
          style={{
            padding: "1.25rem",
            borderLeft: "4px solid var(--muted)",
          }}
        >
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Geen market snapshot. Exporteer eerst vanuit de bot.
          </p>
        </div>
      </section>
    );
  }

  const hasPairs = market.pairs?.length > 0;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Markt / pairs (Tier 1)
      </h2>
      <div
        className="card"
        style={{
          padding: "1rem 1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            marginBottom: hasPairs ? "1rem" : 0,
          }}
        >
          <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
            Symbolen: <strong style={{ color: "var(--accent)" }}>{market.symbol_count}</strong>
          </span>
          {market.run_id != null && (
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              Run #{market.run_id}
            </span>
          )}
        </div>
        {hasPairs ? (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "0.5rem 0.75rem 0.5rem 0", color: "var(--muted)", fontWeight: 600 }}>
                    Symbol
                  </th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "var(--muted)", fontWeight: 600 }}>
                    Trades
                  </th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "var(--muted)", fontWeight: 600 }}>
                    Spread (bps)
                  </th>
                  <th style={{ padding: "0.5rem 0 0.5rem 0.75rem", color: "var(--muted)", fontWeight: 600 }}>
                    Suitability
                  </th>
                </tr>
              </thead>
              <tbody>
                {market.pairs.slice(0, 20).map((p) => (
                  <tr key={p.symbol} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", fontFamily: "monospace" }}>
                      {p.symbol}
                    </td>
                    <td style={{ padding: "0.5rem 0.75rem" }}>{p.trade_count}</td>
                    <td style={{ padding: "0.5rem 0.75rem" }}>
                      {p.avg_spread_bps != null ? p.avg_spread_bps.toFixed(1) : "—"}
                    </td>
                    <td style={{ padding: "0.5rem 0 0.5rem 0.75rem" }}>
                      {p.suitability_score != null ? p.suitability_score.toFixed(2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {market.pairs.length > 20 && (
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem", color: "var(--muted)" }}>
                + {market.pairs.length - 20} meer
              </p>
            )}
          </div>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>Geen pair-data in dit snapshot.</p>
        )}
      </div>
    </section>
  );
}
