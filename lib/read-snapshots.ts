/**
 * Read snapshot JSON files from export directory. BFF only — no direct DB.
 * Tier gating: callers must pass tier; we only read files for allowed families.
 */

import fs from "fs";
import path from "path";
import type {
  AdminObservabilitySnapshot,
  PublicDemoTrades,
  PublicMarketSnapshot,
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
  Tier2ExecutionSnapshot,
  Tier2LatencySnapshot,
  Tier2PnlSnapshot,
  Tier2SafetySnapshot,
} from "./snapshots";

const EXPORT_DIR =
  process.env.OBSERVABILITY_EXPORT_DIR ||
  process.env.OBSERVABILITY_SNAPSHOT_DIR ||
  "./observability_export";

function exportPath(): string {
  const dir = path.isAbsolute(EXPORT_DIR) ? EXPORT_DIR : path.join(process.cwd(), EXPORT_DIR);
  return dir;
}

function readJson<T>(filename: string, retries = 1): T | null {
  const fullPath = path.join(exportPath(), filename);
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = fs.readFileSync(fullPath, "utf-8");
      return JSON.parse(raw) as T;
    } catch {
      if (attempt === retries) return null;
    }
  }
  return null;
}

/** Tier 1: public_status_snapshot */
export function getPublicStatusSnapshot(): PublicStatusSnapshot | null {
  return readJson<PublicStatusSnapshot>("public_status_snapshot.json");
}

/** Tier 1: public_regime_snapshot */
export function getPublicRegimeSnapshot(): PublicRegimeSnapshot | null {
  return readJson<PublicRegimeSnapshot>("public_regime_snapshot.json");
}

/** Tier 1: public_strategy_snapshot */
export function getPublicStrategySnapshot(): PublicStrategySnapshot | null {
  return readJson<PublicStrategySnapshot>("public_strategy_snapshot.json");
}

/** Tier 1: public_market_snapshot */
export function getPublicMarketSnapshot(): PublicMarketSnapshot | null {
  return readJson<PublicMarketSnapshot>("public_market_snapshot.json");
}

/** Tier 1: public_trading_snapshot */
export function getPublicTradingSnapshot(): PublicTradingSnapshot | null {
  return readJson<PublicTradingSnapshot>("public_trading_snapshot.json");
}

/** Tier 1: public_demo_trades */
export function getPublicDemoTrades(): PublicDemoTrades | null {
  return readJson<PublicDemoTrades>("public_demo_trades.json");
}

/** Tier 2: tier2_execution_snapshot */
export function getTier2ExecutionSnapshot(): Tier2ExecutionSnapshot | null {
  return readJson<Tier2ExecutionSnapshot>("tier2_execution_snapshot.json");
}

/** Tier 2: tier2_latency_snapshot */
export function getTier2LatencySnapshot(): Tier2LatencySnapshot | null {
  return readJson<Tier2LatencySnapshot>("tier2_latency_snapshot.json");
}

/** Tier 2: tier2_pnl_snapshot */
export function getTier2PnlSnapshot(): Tier2PnlSnapshot | null {
  return readJson<Tier2PnlSnapshot>("tier2_pnl_snapshot.json");
}

/** Tier 2: tier2_safety_snapshot */
export function getTier2SafetySnapshot(): Tier2SafetySnapshot | null {
  return readJson<Tier2SafetySnapshot>("tier2_safety_snapshot.json");
}

/** Tier 3: admin_observability_snapshot */
export function getAdminObservabilitySnapshot(): AdminObservabilitySnapshot | null {
  return readJson<AdminObservabilitySnapshot>("admin_observability_snapshot.json");
}
