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
  /** Number of symbols with L3 data (l3_count >= 1). Use for L3 availability %. */
  l3_symbol_count?: number | null;
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

export interface EquityPoint {
  ts_bucket: string;
  value: number;
}

export interface LabelCount {
  label: string;
  count: number;
}

export interface LatencyBucketPoint {
  bucket_ms: number;
  count: number;
}

export interface MissedMoveBucket {
  bucket_bps: number;
  count: number;
}

export interface RunHealthPoint {
  run_id: number;
  started_at: string | null;
  ended_at: string | null;
  mode: string | null;
  feed_freshness_secs: number | null;
}

export interface EpochIngestPoint {
  epoch_id: number | null;
  symbols_expected: number | null;
  symbols_ok: number | null;
  is_valid: boolean | null;
}

export interface ExposureSummary {
  open_positions_count: number;
  exit_only_positions_count: number;
  hard_blocked_positions_count: number;
  net_base_position_s: string | null;
  gross_base_position_s: string | null;
  net_entry_notional_quote_s: string | null;
}

export interface SymbolSafetyActiveMode {
  symbol: string;
  mode: string;
}

export interface EventBufferKpis {
  buffered_count: number;
  released_count: number;
  timed_out_count: number;
  unknown_state_count: number;
}

export interface Tier2ExecutionSnapshot {
  contract_version: string;
  exported_at: string;
  orders_24h_count: number;
  fills_24h_count: number;
  symbols_traded_24h?: number | null;
  run_health_timeline?: RunHealthPoint[] | null;
  epoch_ingest_point?: EpochIngestPoint | null;
  orders_status_counts_24h?: LabelCount[] | null;
  fills_side_counts_24h?: LabelCount[] | null;
  shadow_outcome_counts?: LabelCount[] | null;
  shadow_missed_move_histogram?: MissedMoveBucket[] | null;
  event_buffer_kpis?: EventBufferKpis | null;
}

export interface Tier2LatencySnapshot {
  contract_version: string;
  exported_at: string;
  submit_to_ack_ms_avg?: number | null;
  sample_count: number;
  total_orders_24h?: number | null;
  count_with_exit?: number | null;
  submit_to_ack_histogram_ms_24h?: LatencyBucketPoint[] | null;
  fill_to_exit_submit_histogram_ms_24h?: LatencyBucketPoint[] | null;
}

export interface Tier2PnlSnapshot {
  contract_version: string;
  exported_at: string;
  realized_pnl_quote_24h: number | null;
  equity_trend_delayed?: EquityPoint[] | null;
  drawdown_pct?: number | null;
  exposure_summary?: ExposureSummary | null;
}

export interface Tier2SafetySnapshot {
  contract_version: string;
  exported_at: string;
  safety_normal_count: number;
  safety_exit_only_count: number;
  safety_hard_blocked_count: number;
  symbol_safety_active_modes?: SymbolSafetyActiveMode[] | null;
}

export interface AdminObservabilitySnapshot {
  contract_version: string;
  exported_at: string;
  run_id: number | null;
  epoch_status: string | null;
  data_freshness_secs: number | null;
  orders_24h_count: number;
  fills_24h_count: number;
  safety_normal_count: number;
  safety_exit_only_count: number;
  safety_hard_blocked_count: number;
}

export type Tier = 1 | 2 | 3;
