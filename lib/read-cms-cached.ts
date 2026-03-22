/**
 * Redis-cache voor CMS JSON (CMS_CACHE_TTL_SEC, default 120s).
 */

import { getRedis } from "@/lib/redis-client";
import type { CmsData, ProductionNoteRow } from "@/lib/read-cms";
import { getCmsData, getProductionNotes } from "@/lib/read-cms";

const TTL_SEC = Math.max(15, parseInt(process.env.CMS_CACHE_TTL_SEC || "120", 10));

export async function getProductionNotesCached(): Promise<ProductionNoteRow[]> {
  const r = await getRedis();
  const key = "kb:cms:v1:production_notes";
  if (r) {
    try {
      const hit = await r.get(key);
      if (hit) return JSON.parse(hit) as ProductionNoteRow[];
    } catch {
      /* fall through */
    }
  }
  const data = getProductionNotes();
  if (r) {
    try {
      await r.set(key, JSON.stringify(data), { EX: TTL_SEC });
    } catch {
      /* ignore */
    }
  }
  return data;
}

export async function getCmsDataCached(): Promise<CmsData | null> {
  const r = await getRedis();
  const key = "kb:cms:v1:cms_data";
  if (r) {
    try {
      const hit = await r.get(key);
      if (hit === "null") return null;
      if (hit) return JSON.parse(hit) as CmsData;
    } catch {
      /* fall through */
    }
  }
  const data = getCmsData();
  if (r) {
    try {
      await r.set(key, JSON.stringify(data), { EX: TTL_SEC });
    } catch {
      /* ignore */
    }
  }
  return data;
}
