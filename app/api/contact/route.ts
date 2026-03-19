import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export const dynamic = "force-dynamic";

const rateLimit = new Map<string, { count: number; since: number }>();
const RATE_LIMIT_MS = 120_000;
const RATE_LIMIT_MAX = 5;

function getClientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  let entry = rateLimit.get(key);
  if (!entry || now - entry.since > RATE_LIMIT_MS) {
    rateLimit.set(key, { count: 1, since: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function clamp(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max);
}

export async function POST(req: NextRequest) {
  const key = getClientKey(req);
  if (!checkRateLimit(key)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: { name?: string; email?: string; message?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? clamp(body.name, 200) : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? clamp(body.message, 8000) : "";
  const locale = typeof body.locale === "string" ? body.locale.slice(0, 5) : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ error: "Message too short (min 10 characters)." }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL_TO || process.env.TIER2_ADMIN_EMAIL || "info@kapitaalbot.nl";
  const from = process.env.TIER2_EMAIL_FROM || "KapitaalBot <info@kapitaalbot.nl>";
  const subject = `KapitaalBot contact (${locale || "?"}) — ${email}`;

  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    `Name: ${name || "(not provided)"}`,
    `Email: ${email}`,
    `Locale: ${locale || "unknown"}`,
    "",
    message,
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
        if (!errored && code === 0) resolve();
        else if (!errored) reject(new Error(`sendmail exit ${code}`));
      });
    });
  } catch (err) {
    console.error("contact sendmail error", err);
    return NextResponse.json({ error: "Could not send message. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
