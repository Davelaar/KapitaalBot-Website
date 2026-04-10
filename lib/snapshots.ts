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
  source_run_id?: number | null;
  source_kind?: string | null;
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

/** Tier 1: last-N execution orders from bot export (timestamps bucketed). */
export interface RecentPublicOrderRow {
  ts_bucket: string;
  symbol: string;
  side: string;
  order_type: string;
  status: string;
  quantity_base: string;
  limit_price_quote?: string | null;
  route_name?: string | null;
  regime?: string | null;
  strategy?: string | null;
  order_ref: string;
}

/** Tier 1: last-N fills from bot export (timestamps bucketed). */
export interface RecentPublicFillRow {
  ts_bucket: string;
  symbol: string;
  side: string;
  fill_qty_base: string;
  fill_price_quote: string;
  fee_quote?: string | null;
}

export interface SymbolPnlDayRow {
  symbol: string;
  realized_pnl_quote: number;
}

/** Fill slippage vs CDV `slippage_bps_estimate` (24h, decision DB). */
export interface SlippageExampleRow {
  symbol: string;
  expected_slippage_bps: number;
  realized_slippage_bps: number;
  /** realized − expected (positive = worse than model). */
  delta_bps: number;
}

export interface SlippageVariance24h {
  sample_n: number;
  mean_delta_bps?: number | null;
  median_delta_bps?: number | null;
  notable_examples?: SlippageExampleRow[];
}

/** Closed `realized_pnl` rows in 24h; benchmarks are fixed 1m / 3m / 15m (not per-route yet). */
export interface HoldTimeVsHorizon24h {
  closed_positions_n: number;
  median_hold_secs?: number | null;
  p90_hold_secs?: number | null;
  pct_hold_over_1m?: number | null;
  pct_hold_over_3m?: number | null;
  pct_hold_over_15m?: number | null;
}

export interface FeeImpact24h {
  fees_paid_quote: number;
  realized_pnl_net_quote: number;
  /** fees / |net PnL| when denominator meaningful. */
  fee_to_abs_net_pnl_ratio?: number | null;
  fills_with_fee_count: number;
}

export interface PublicTradingSnapshot {
  contract_version: string;
  exported_at: string;
  trades_24h_count: number;
  orders_24h_count: number;
  drawdown_pct?: number | null;
  equity_trend_delayed?: EquityPoint[] | null;
  recent_orders?: RecentPublicOrderRow[];
  recent_fills?: RecentPublicFillRow[];
  top_reject_reasons_last_hour?: LabelCount[];
  why_no_trade_top_last_hour?: LabelCount[];
  route_wins_last_hour?: LabelCount[];
  /** Top symbols by realized PnL for current UTC calendar day (quote ccy). */
  symbol_pnl_day_utc_top_winners?: SymbolPnlDayRow[];
  symbol_pnl_day_utc_top_losers?: SymbolPnlDayRow[];
  slippage_variance_24h?: SlippageVariance24h | null;
  hold_time_vs_horizon_24h?: HoldTimeVsHorizon24h | null;
  fee_impact_24h?: FeeImpact24h | null;
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

/** Matches KRAKENBOT `RunHealthPoint` JSON (observability snapshot export). */
export interface RunHealthPoint {
  run_id: number;
  started_at: string | null;
  ended_at: string | null;
  mode: string | null;
  feed_freshness_secs: number | null;
  ticker_rows?: number;
  trade_rows?: number;
  l2_rows?: number;
  l3_rows?: number;
}

/** Matches KRAKENBOT `EpochIngestPoint` JSON. */
export interface EpochIngestPoint {
  epoch_id: number;
  status: string;
  symbol_count: number;
  criteria_ticker_ok: boolean;
  criteria_trade_ok: boolean;
  criteria_l2_ok: boolean;
  criteria_l3_ok: boolean;
  completed_at?: string | null;
}

/** Matches KRAKENBOT `ExposureSummary` JSON. */
export interface ExposureSummary {
  open_positions_count: number;
  long_positions_count: number;
  short_positions_count: number;
  net_base_position: number;
  gross_base_position: number;
  net_entry_notional_quote?: number | null;
}

export interface SymbolSafetyActiveMode {
  symbol: string;
  mode: string;
  quiet_until?: string | null;
  hard_block_until?: string | null;
}

/** Matches KRAKENBOT `EventBufferKpis` JSON. */
export interface EventBufferKpis {
  buffered_active_count: number;
  buffered_total_count: number;
  released_24h_count: number;
  timeout_24h_count: number;
  unknown_24h_count: number;
  status_counts_24h?: LabelCount[] | null;
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
  avg_ack_ms?: number | null;
  max_ack_ms?: number | null;
  total_orders_24h?: number | null;
  avg_fill_to_exit_submit_ms?: number | null;
  max_fill_to_exit_submit_ms?: number | null;
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
  sharpe_like_24h?: number | null;
  sortino_like_24h?: number | null;
  max_drawdown_duration_buckets_24h?: number | null;
  exposure_summary?: ExposureSummary | null;
}

export interface Tier2SafetySnapshot {
  contract_version: string;
  exported_at: string;
  safety_normal_count: number;
  safety_exit_only_count: number;
  safety_hard_blocked_count: number;
  active_quiets?: number | null;
  active_hard_blocks?: number | null;
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
  edgeboard?: {
    available: boolean;
    snapshot_ts?: string | null;
    visible_symbols?: number | null;
    positive_edge_symbols?: number | null;
    max_expected_net_edge_bps?: number | null;
    training_examples_24h?: number | null;
    outcomes_24h?: number | null;
  } | null;
}

export type Tier = 1 | 2 | 3;

// --- tier2_data_bundle.json (contract 1.1+) — dual-DB observability Data menu ---

export interface Tier2DisclosurePolicy {
  kind: string;
  bucket_minutes: number;
  as_of_utc: string;
  explanation_nl: string;
}

export interface Tier2DataSourceMeta {
  intake_role: string;
  decision_role: string;
  research_role?: string | null;
}

export interface Tier2IntakeUniverseSection {
  source_db: string;
  epoch_id?: number | null;
  epoch_status?: string | null;
  epoch_symbol_count?: number | null;
  criteria_ticker_ok?: boolean | null;
  criteria_trade_ok?: boolean | null;
  criteria_l2_ok?: boolean | null;
  criteria_l3_ok?: boolean | null;
  run_id?: number | null;
  run_symbol_rows?: number | null;
  run_ticker_sum?: number | null;
  run_trade_sum?: number | null;
  run_l2_sum?: number | null;
  run_l3_sum?: number | null;
}

export interface Tier2RouteNoTradeSection {
  source_db: string;
  funnel_stage_counts_24h: LabelCount[];
  funnel_decision_code_counts_24h: LabelCount[];
  funnel_reason_top_24h: LabelCount[];
  shadow_blocker_counts?: LabelCount[] | null;
  path_tape_event_counts_24h: LabelCount[];
}

export interface Tier2RiskCapitalSection {
  source_db: string;
  symbol_safety_by_mode: LabelCount[];
  funnel_capital_events_24h: number;
}

export interface Tier2EntryExecutionSection {
  source_db: string;
  execution_stage_events_24h: number;
  fill_stage_events_24h: number;
  orders_with_correlation_24h: number;
}

export interface Tier2PathDoctrineSection {
  source_db: string;
  orders_by_path_tape_24h: LabelCount[];
  funnel_rows_with_path_tape_24h: number;
}

export interface Tier2InfraSection {
  source_db: string;
  recovery_requests_24h: number;
  latest_watchdog_state?: string | null;
  event_buffer_unknown_24h?: number | null;
}

export interface Tier2MarketForecastRow {
  symbol: string;
  expected_direction_15m: string;
  expected_move_15m_bps: number;
  confidence_15m: number;
  recommended_route_type?: string | null;
  recommended_entry_mode?: string | null;
  recommended_exit_mode?: string | null;
  recommended_horizon_secs?: number | null;
  reason_code: string;
  soft_gate_score: number;
  forecast_basis: string;
}

export interface Tier2MarketForecastSection {
  source_db: string;
  run_id: number;
  evaluation_index: number;
  symbols_total: number;
  forecasts: Tier2MarketForecastRow[];
}

export interface Tier2EdgeboardSignalRow {
  rank: number;
  symbol: string;
  route_name: string;
  horizon_sec: number;
  /** Scaled/visible gross from edgeboard snapshot row. */
  expected_gross_move_bps?: number | null;
  /** Statistical gross before pooled semantic scaling (when present). */
  statistical_gross_bps?: number | null;
  /** Applied pooled semantic scale (when present and pooled). */
  pooled_semantic_gross_scale?: number | null;
  expected_cost_bps?: number | null;
  expected_net_edge_bps: number;
  confidence: number;
  sample_size: number;
  boost: number;
  dominant_reason_code?: string | null;
  feature_coverage_class?: string | null;
  freshness_ms?: number | null;
  /** Provenance: "edgeboard_research" or "decision_fallback". */
  edge_source_version?: string | null;
}

export interface Tier2EdgeboardCandidateRow {
  symbol: string;
  best_rank: number;
  best_expected_net_edge_bps: number;
  best_confidence: number;
  preferred_horizon_sec?: number | null;
  exit_bias_tag?: string | null;
}

export interface Tier2EdgeboardSection {
  source_db: string;
  available: boolean;
  snapshot_ts?: string | null;
  delay_until?: string | null;
  expires_at?: string | null;
  model_version?: string | null;
  visible_rows?: number | null;
  visible_symbols?: number | null;
  positive_edge_symbols?: number | null;
  avg_confidence?: number | null;
  avg_expected_net_edge_bps?: number | null;
  max_expected_net_edge_bps?: number | null;
  training_examples_24h?: number | null;
  outcomes_24h?: number | null;
  /** Age of snapshot being served (ms since snapshot_ts). */
  snapshot_age_ms?: number | null;
  top_signals: Tier2EdgeboardSignalRow[];
  /** Per-symbol rollup (best route per symbol); may be absent in older exports. */
  candidates?: Tier2EdgeboardCandidateRow[] | null;
}

/** Single bundle for Tier 2 Data menu (ingest + decision aggregates). */
export interface Tier2DataBundle {
  contract_version: string;
  exported_at: string;
  disclosure_policy: Tier2DisclosurePolicy;
  source_db: Tier2DataSourceMeta;
  intake_universe?: Tier2IntakeUniverseSection | null;
  route_no_trade?: Tier2RouteNoTradeSection | null;
  risk_capital?: Tier2RiskCapitalSection | null;
  entry_execution?: Tier2EntryExecutionSection | null;
  path_doctrine?: Tier2PathDoctrineSection | null;
  infra?: Tier2InfraSection | null;
  market_forecast_15m?: Tier2MarketForecastSection | null;
  edgeboard?: Tier2EdgeboardSection | null;
}
