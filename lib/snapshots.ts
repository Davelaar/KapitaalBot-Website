/**
 * Snapshot types (contract_version 1.0). Must match bot export.
 * See KRAKENBOTMAART docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md
 */

export interface PublicStatusSnapshot {
  contract_version: string;
  exported_at: string;
  run_id: number | null;
  run_started_at: string | null;
  run_ended_at: string | null;
  latest_epoch_id: number | null;
  epoch_status: string | null;
  epoch_symbol_count: number | null;
  data_freshness_secs: number | null;
  ticker_count: number;
  trade_count: number;
  l2_count: number;
  l3_count: number;
  safety_normal_count: number;
  safety_exit_only_count: number;
  safety_hard_blocked_count: number;
}

export interface RegimeCount {
  regime: string;
  count: number;
}

export interface PublicRegimeSnapshot {
  contract_version: string;
  exported_at: string;
  active_regimes: RegimeCount[];
  dominant_regime: string | null;
  regime_switches_last_hour: number | null;
}

export interface StrategyCount {
  strategy: string;
  count: number;
}

export interface PublicStrategySnapshot {
  contract_version: string;
  exported_at: string;
  active_strategies: StrategyCount[];
  strategy_count: number;
}

export interface MarketPairRow {
  symbol: string;
  trade_count: number;
  avg_spread_bps: number | null;
  suitability_score: number | null;
}

export interface PublicMarketSnapshot {
  contract_version: string;
  exported_at: string;
  run_id: number | null;
  pairs: MarketPairRow[];
  symbol_count: number;
}

export interface PublicTradingSnapshot {
  contract_version: string;
  exported_at: string;
  trades_24h_count: number;
  orders_24h_count: number;
  drawdown_pct: number | null;
}

export interface DemoTradeRow {
  symbol: string;
  side: string;
  outcome: string | null;
  result_bps: number | null;
  lifecycle_summary: string;
}

export interface PublicDemoTrades {
  contract_version: string;
  exported_at: string;
  demo_trades: DemoTradeRow[];
}

export type Tier = 1 | 2 | 3;
