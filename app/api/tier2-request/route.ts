import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tier2_requests.json");

interface Tier2RequestRow {
  email: string;
  reason: string;
  created_at: string;
  status: string;
}

const rateLimit = new Map<string, { count: number; since: number }>();
const RATE_LIMIT_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;

function getClientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  let entry = rateLimit.get(key);
  if (!entry || now - entry.since > RATE_LIMIT_MS) {
    entry = { count: 1, since: now };
    rateLimit.set(key, entry);
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function readRequests(): Tier2RequestRow[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeRequests(rows: Tier2RequestRow[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2), "utf-8");
  } catch (err) {
    console.error("tier2-request write error", err);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  const key = getClientKey(req);
  if (!checkRateLimit(key)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  let body: { email?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required." },
      { status: 400 }
    );
  }

  const row: Tier2RequestRow = {
    email,
    reason: reason || "(no reason provided)",
    created_at: new Date().toISOString(),
    status: "pending",
  };

  try {
    const rows = readRequests();
    rows.push(row);
    writeRequests(rows);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save request." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: "Request received." });
}
