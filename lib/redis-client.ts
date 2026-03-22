/**
 * Optionele Redis voor snapshot/CMS-cache (zelfde REDIS_URL als elders op de server).
 * Bij ontbrekende URL of connectfout: null — callers lezen rechtstreeks van schijf.
 */

import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;
let connectFailed = false;

export async function getRedis(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (connectFailed) return null;
  if (client?.isOpen) return client;

  try {
    const c = createClient({ url });
    c.on("error", () => {});
    await c.connect();
    client = c as RedisClient;
    return client;
  } catch {
    connectFailed = true;
    return null;
  }
}
