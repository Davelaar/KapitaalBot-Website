/**
 * Tier-based session auth. Cookie is signed server-side; Tier 2/3 pages require valid session.
 * Tier 2: granted via access code (TIER2_SECRET). Tier 3: admin (TIER3_SECRET).
 */

import { cookies } from "next/headers";
import crypto from "crypto";

export type Tier = 1 | 2 | 3;

const COOKIE_NAME = "tier_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const AUTH_COOKIE_NAME = COOKIE_NAME;
export const AUTH_COOKIE_MAX_AGE = COOKIE_MAX_AGE;

function getSecret(): string {
  const s = process.env.TIER_COOKIE_SECRET;
  if (!s || s.length < 16) return "";
  return s;
}

function sign(payload: string): string {
  const secret = getSecret();
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function verify(payload: string, sig: string): boolean {
  const expected = sign(payload);
  if (expected.length !== sig.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"));
  } catch {
    return false;
  }
}

/** Server-only: read tier from signed cookie. Returns 1 if no/invalid cookie. */
export async function getSessionTier(): Promise<Tier> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return 1;
  const i = raw.indexOf(".");
  if (i <= 0) return 1;
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  if (!verify(payload, sig)) return 1;
  let data: { t?: number; exp?: number };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return 1;
  }
  if (typeof data.t !== "number" || data.t < 1 || data.t > 3) return 1;
  if (data.exp != null && Math.floor(Date.now() / 1000) > data.exp) return 1;
  return data.t as Tier;
}

/** Server-only: set tier session cookie (called from API route). */
export function setSessionCookiePayload(tier: Tier): string {
  const secret = getSecret();
  if (!secret) return "";
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ t: tier, exp }), "utf8").toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function requireTier(minTier: Tier): Promise<boolean> {
  return getSessionTier().then((t) => t >= minTier);
}
