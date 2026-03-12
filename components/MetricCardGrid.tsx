import type {
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
} from "@/lib/snapshots";

export interface MetricCardGridProps {
  status: PublicStatusSnapshot | null;
  trading: PublicTradingSnapshot | null;
  regime: PublicRegimeSnapshot | null;
  strategy: PublicStrategySnapshot | null;
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "1rem 1.25rem",
      }}
    >
      <div
        className="metric-card__value"
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--accent)",
        }}
      >
        {value}
      </div>
      <div
        className="metric-card__label"
        style={{
          fontSize: "0.875rem",
          color: "var(--muted)",
          marginTop: "0.25rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function MetricCardGrid({
  status,
  trading,
  regime,
  strategy,
}: MetricCardGridProps) {
  const hasAny =
    status !== null ||
    trading !== null ||
    regime !== null ||
    strategy !== null;

  if (!hasAny) {
    return (
      <section>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          Metric cards
        </h2>
        <div
          className="card"
          style={{
            padding: "1.25rem",
            borderLeft: "4px solid var(--muted)",
          }}
        >
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Geen snapshot-data. Exporteer eerst snapshots vanuit de bot.
          </p>
        </div>
      </section>
    );
  }

  const activeRegimes = regime?.active_regimes?.length ?? 0;
  const activeStrategies = strategy?.strategy_count ?? 0;
  const trades24h = trading?.trades_24h_count ?? 0;
  const orders24h = trading?.orders_24h_count ?? 0;
  const safetyExitOnly = status?.safety_exit_only_count ?? 0;
  const safetyBlocked = status?.safety_hard_blocked_count ?? 0;
  const guardInterventions = safetyExitOnly + safetyBlocked;
  const freshness =
    status?.data_freshness_secs != null ? String(status.data_freshness_secs) : "—";
  const drawdown = trading?.drawdown_pct != null ? `${trading.drawdown_pct.toFixed(2)}%` : "—";
  const symbolCount = status?.epoch_symbol_count ?? "—";

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
        <MetricCard label="Data freshness (sec)" value={freshness} />
        <MetricCard label="Trades (24h)" value={trades24h} />
        <MetricCard label="Orders (24h)" value={orders24h} />
        <MetricCard label="Drawdown %" value={drawdown} />
        <MetricCard label="Symbol count" value={symbolCount} />
      </div>
    </section>
  );
}
