/**
 * Redis-cache rond read-snapshots (TTL via SNAPSHOT_CACHE_TTL_SEC, default 30s).
 * Zonder REDIS_URL: gedrag gelijk aan sync getters.
 */

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
} from "@/lib/snapshots";
import { getRedis } from "@/lib/redis-client";
import * as raw from "@/lib/read-snapshots";

const TTL_SEC = Math.max(5, parseInt(process.env.SNAPSHOT_CACHE_TTL_SEC || "30", 10));

async function cached<T>(redisKey: string, loader: () => T | null): Promise<T | null> {
  const r = await getRedis();
  if (r) {
    try {
      const hit = await r.get(redisKey);
      if (hit) return JSON.parse(hit) as T;
    } catch {
      /* fall through */
    }
  }
  const data = loader();
  if (r && data !== null) {
    try {
      await r.set(redisKey, JSON.stringify(data), { EX: TTL_SEC });
    } catch {
      /* ignore */
    }
  }
  return data;
}

export async function getPublicStatusSnapshotCached(): Promise<PublicStatusSnapshot | null> {
  return cached("kb:snap:v1:public_status", () => raw.getPublicStatusSnapshot());
}

export async function getPublicRegimeSnapshotCached(): Promise<PublicRegimeSnapshot | null> {
  return cached("kb:snap:v1:public_regime", () => raw.getPublicRegimeSnapshot());
}

export async function getPublicStrategySnapshotCached(): Promise<PublicStrategySnapshot | null> {
  return cached("kb:snap:v1:public_strategy", () => raw.getPublicStrategySnapshot());
}

export async function getPublicMarketSnapshotCached(): Promise<PublicMarketSnapshot | null> {
  return cached("kb:snap:v1:public_market", () => raw.getPublicMarketSnapshot());
}

export async function getPublicTradingSnapshotCached(): Promise<PublicTradingSnapshot | null> {
  return cached("kb:snap:v1:public_trading", () => raw.getPublicTradingSnapshot());
}

export async function getPublicDemoTradesCached(): Promise<PublicDemoTrades | null> {
  return cached("kb:snap:v1:public_demo_trades", () => raw.getPublicDemoTrades());
}

export async function getTier2ExecutionSnapshotCached(): Promise<Tier2ExecutionSnapshot | null> {
  return cached("kb:snap:v1:tier2_execution", () => raw.getTier2ExecutionSnapshot());
}

export async function getTier2LatencySnapshotCached(): Promise<Tier2LatencySnapshot | null> {
  return cached("kb:snap:v1:tier2_latency", () => raw.getTier2LatencySnapshot());
}

export async function getTier2PnlSnapshotCached(): Promise<Tier2PnlSnapshot | null> {
  return cached("kb:snap:v1:tier2_pnl", () => raw.getTier2PnlSnapshot());
}

export async function getTier2SafetySnapshotCached(): Promise<Tier2SafetySnapshot | null> {
  return cached("kb:snap:v1:tier2_safety", () => raw.getTier2SafetySnapshot());
}

export async function getAdminObservabilitySnapshotCached(): Promise<AdminObservabilitySnapshot | null> {
  return cached("kb:snap:v1:admin_observability", () => raw.getAdminObservabilitySnapshot());
}
