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

interface MetricCardProps {
  label: string;
  value: string | number;
  chip?: "good" | "warn" | "stale" | "neutral";
  progress?: number; // 0–100
}

function MetricCard({ label, value, chip, progress }: MetricCardProps) {
  const chipStyle =
    chip === "good"
      ? { background: "var(--freshness-good)", color: "#fff" }
      : chip === "warn"
        ? { background: "var(--freshness-warn)", color: "#0f1419" }
        : chip === "stale"
          ? { background: "var(--freshness-stale)", color: "#fff" }
          : undefined;

  return (
    <div
      className="card"
      style={{
        padding: "1rem 1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
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
        {chip != null && chipStyle && (
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              padding: "0.15rem 0.4rem",
              borderRadius: 6,
              ...chipStyle,
            }}
          >
            {chip.toUpperCase()}
          </span>
        )}
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
      {progress != null && (
        <div
          style={{
            marginTop: "0.5rem",
            height: 4,
            background: "var(--border)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: "var(--accent)",
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}

function drawdownSeverity(drawdownPct: number | null): "good" | "warn" | "stale" | "neutral" {
  if (drawdownPct == null) return "neutral";
  if (drawdownPct <= 2) return "good";
  if (drawdownPct <= 5) return "warn";
  return "stale";
}

export default function MetricCardGrid({
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
            Awaiting bot export…
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--muted)" }}>
            Export snapshots from the bot to see metrics here.
          </p>
        </div>
      </section>
    );
  }

  const activeRegimes = regime?.active_regimes?.length ?? 0;
  const activeStrategies = strategy?.strategy_count ?? 0;
  const trades24h = trading?.trades_24h_count ?? 0;
  const orders24h = trading?.orders_24h_count ?? 0;
  const safetyBlocked = status?.safety_hard_blocked_count ?? 0;
  const safetyExitOnly = status?.safety_exit_only_count ?? 0;
  const guardInterventions = safetyExitOnly + safetyBlocked;
  const freshnessSecs = status?.data_freshness_secs ?? null;
  const freshnessVal =
    freshnessSecs != null ? String(freshnessSecs) : "—";
  const drawdownPct = trading?.drawdown_pct ?? null;
  const drawdown =
    drawdownPct != null ? `${drawdownPct.toFixed(2)}%` : "—";
  const symbolCount = status?.epoch_symbol_count ?? 0;
  const l3Count = status?.l3_count ?? 0;
  const l3Pct =
    symbolCount > 0 && status?.l3_count != null
      ? Math.round((status.l3_count / symbolCount) * 100)
      : null;
  const regimeSwitches1h = regime?.regime_switches_last_hour ?? null;

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
        <MetricCard label="Safety Hard Blocks" value={safetyBlocked} chip={safetyBlocked > 0 ? "warn" : "good"} />
        <MetricCard label="Active Symbols" value={symbolCount} />
        <MetricCard
          label="L3 Availability %"
          value={l3Pct != null ? `${l3Pct}%` : l3Count}
          progress={l3Pct ?? undefined}
        />
        <MetricCard label="Regime Switches (1h)" value={regimeSwitches1h ?? "—"} />
        <MetricCard label="Strategy Count" value={activeStrategies} />
        <MetricCard
          label="Drawdown"
          value={drawdown}
          chip={drawdownSeverity(drawdownPct)}
        />
        <MetricCard label="Active Regimes" value={activeRegimes} />
        <MetricCard label="Guard Interventions" value={guardInterventions} />
        <MetricCard label="Data Freshness (s)" value={freshnessVal} />
        <MetricCard label="Trades (24h)" value={trades24h} />
        <MetricCard label="Orders (24h)" value={orders24h} />
      </div>
    </section>
  );
}
