import type { PublicMarketSnapshot } from "@/lib/snapshots";
import { MarketSummaryTable } from "@/components/MarketSummaryTable";

export interface MarketSummaryProps {
  market: PublicMarketSnapshot | null;
}

export default function MarketSummary({ market }: MarketSummaryProps) {
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
            Awaiting bot export…
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--muted)" }}>
            Export market snapshot from the bot to see pairs here.
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
          <>
            <MarketSummaryTable pairs={market.pairs} />
            {market.pairs.length > 20 && (
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem", color: "var(--muted)" }}>
                + {market.pairs.length - 20} meer
              </p>
            )}
          </>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>Geen pair-data in dit snapshot.</p>
        )}
      </div>
    </section>
  );
}
