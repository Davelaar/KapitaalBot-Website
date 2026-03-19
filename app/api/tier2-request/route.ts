import { NextRequest, NextResponse } from "next/server";
import { readTier2Requests, writeTier2Requests, Tier2RequestRow } from "@/lib/tier2-requests";
import { spawn } from "child_process";

export const dynamic = "force-dynamic";

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
    const rows = readTier2Requests();
    rows.push(row);
    writeTier2Requests(rows);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save request." },
      { status: 500 }
    );
  }

  // Notify admin about new request via local Postfix (optional but enabled by default).
  const adminTo = process.env.TIER2_ADMIN_EMAIL || "info@kapitaalbot.nl";
  const from = process.env.TIER2_EMAIL_FROM || "KapitaalBot <info@kapitaalbot.nl>";
  const subject = "Nieuwe KapitaalBot Tier 2-aanvraag";
  const loginUrl =
    process.env.TIER2_LOGIN_URL ||
    (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/admin/access` : "/admin/access");
  const lines = [
    `From: ${from}`,
    `To: ${adminTo}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    "Er is een nieuwe aanvraag voor Tier 2-toegang binnengekomen:",
    "",
    `E-mail: ${email}`,
    `Reden: ${reason || "(geen reden opgegeven)"}`,
    "",
    `Je kunt de aanvraag bekijken en goedkeuren via: ${loginUrl}`,
    "",
    "Deze mail is automatisch verstuurd door de KapitaalBot-website.",
    "",
  ].join("\n");

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn("/usr/sbin/sendmail", ["-t"]);
      let errored = false;
      child.on("error", (err) => {
        errored = true;
        reject(err);
      });
      child.stdin.write(lines);
      child.stdin.end();
      child.on("close", (code) => {
        if (!errored && code === 0) {
          resolve();
        } else if (!errored) {
          reject(new Error(`sendmail exited with code ${code}`));
        }
      });
    });
  } catch (err) {
    console.error("tier2-request admin notification sendmail error", err);
    // Niet falen richting gebruiker; aanvraag is al opgeslagen.
  }

  return NextResponse.json({ ok: true, message: "Request received." });
}
