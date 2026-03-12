import { getPublicStatusSnapshot } from "@/lib/read-snapshots";
import { getPublicRegimeSnapshot } from "@/lib/read-snapshots";
import { getPublicStrategySnapshot } from "@/lib/read-snapshots";
import { getPublicTradingSnapshot } from "@/lib/read-snapshots";

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__label">{label}</div>
    </div>
  );
}

export async function MetricCardGrid() {
  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();

  const activeRegimes = regime?.active_regimes?.length ?? 0;
  const activeStrategies = strategy?.strategy_count ?? 0;
  const trades24h = trading?.trades_24h_count ?? 0;
  const orders24h = trading?.orders_24h_count ?? 0;
  const safetyExitOnly = status?.safety_exit_only_count ?? 0;
  const safetyBlocked = status?.safety_hard_blocked_count ?? 0;
  const guardInterventions = safetyExitOnly + safetyBlocked;

  return (
    <section>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Metric cards
      </h2>
      <div
        className="metric-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        <MetricCard label="Active regimes" value={activeRegimes} />
        <MetricCard label="Active strategies" value={activeStrategies} />
        <MetricCard label="Guard interventions" value={guardInterventions} />
        <MetricCard
          label="Data freshness (sec)"
          value={status?.data_freshness_secs ?? "—"}
        />
        <MetricCard label="Trades (24h)" value={trades24h} />
        <MetricCard label="Orders (24h)" value={orders24h} />
      </div>
    </section>
  );
}
