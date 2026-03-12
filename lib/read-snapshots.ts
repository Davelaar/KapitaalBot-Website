/**
 * Read snapshot JSON files from export directory. BFF only — no direct DB.
 * Tier gating: callers must pass tier; we only read files for allowed families.
 */

import fs from "fs";
import path from "path";
import type {
  PublicMarketSnapshot,
  PublicRegimeSnapshot,
  PublicStatusSnapshot,
  PublicStrategySnapshot,
  PublicTradingSnapshot,
} from "./snapshots";

const EXPORT_DIR =
  process.env.OBSERVABILITY_EXPORT_DIR ||
  process.env.OBSERVABILITY_SNAPSHOT_DIR ||
  "./observability_export";

function exportPath(): string {
  const dir = path.isAbsolute(EXPORT_DIR) ? EXPORT_DIR : path.join(process.cwd(), EXPORT_DIR);
  return dir;
}

function readJson<T>(filename: string): T | null {
  try {
    const fullPath = path.join(exportPath(), filename);
    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
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

/** Current tier from session (placeholder: always 1 for now; auth in Phase 6). */
export function getTierFromRequest(): 1 | 2 | 3 {
  // TODO: read from session cookie / token
  return 1;
}
