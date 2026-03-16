import BarChart from "@/components/BarChart";
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
  const regimeItems =
    regime?.active_regimes?.map((r) => ({ label: r.regime, value: r.count })) ?? [];
  const strategyItems =
    strategy?.active_strategies?.map((s) => ({ label: s.strategy, value: s.count })) ?? [];

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Regime & strategy (Tier 1)
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        <BarChart
          title="Regime distribution (24h)"
          items={regimeItems}
          maxBarWidthPx={180}
        />
        <BarChart
          title="Strategy distribution (24h)"
          items={strategyItems}
          maxBarWidthPx={180}
        />
      </div>
      {regime?.dominant_regime && (
        <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.2rem 0.5rem",
              borderRadius: 6,
              background: "var(--accent)",
              color: "var(--bg)",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            Dominant regime: {regime.dominant_regime}
          </span>
        </p>
      )}
    </section>
  );
}
