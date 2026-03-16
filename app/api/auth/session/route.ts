import { NextRequest, NextResponse } from "next/server";
import { setSessionCookiePayload, AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

const rateLimit = new Map<string, { count: number; since: number }>();
const RATE_MS = 60_000;
const RATE_MAX = 5;

function getClientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  let entry = rateLimit.get(key);
  if (!entry || now - entry.since > RATE_MS) {
    entry = { count: 1, since: now };
    rateLimit.set(key, entry);
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const key = getClientKey(req);
  if (!checkRateLimit(key)) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code) {
    return NextResponse.json({ error: "Code required." }, { status: 400 });
  }

  const tier2Secret = process.env.TIER2_SECRET;
  const tier3Secret = process.env.TIER3_SECRET;

  let tier: 2 | 3 | null = null;
  if (tier3Secret && code === tier3Secret) tier = 3;
  else if (tier2Secret && code === tier2Secret) tier = 2;

  if (tier == null) {
    return NextResponse.json({ error: "Invalid code." }, { status: 401 });
  }

  const value = setSessionCookiePayload(tier);
  if (!value) {
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  const isProd = process.env.NODE_ENV === "production";
  const cookie = [
    `${AUTH_COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${AUTH_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
    ...(isProd ? ["Secure"] : []),
  ].join("; ");

  const res = NextResponse.json({ ok: true, tier });
  res.headers.set("Set-Cookie", cookie);
  return res;
}

export async function DELETE() {
  const cookie = [
    `${AUTH_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Max-Age=0",
    "SameSite=Lax",
  ].join("; ");
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
