import { NextRequest, NextResponse } from "next/server";
import { getSessionTier } from "@/lib/auth";
import { readTier2Requests, writeTier2Requests } from "@/lib/tier2-requests";
import { spawn } from "child_process";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const tier = await getSessionTier();
  if (tier < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const rows = readTier2Requests();
  const idx = rows.findIndex((r) => r.email === email && r.status === "pending");
  if (idx === -1) {
    return NextResponse.json({ error: "No pending request found for this email." }, { status: 404 });
  }

  rows[idx].status = "approved";
  writeTier2Requests(rows);

  const tier2Code = process.env.TIER2_SECRET || "";
  const loginUrl =
    process.env.TIER2_LOGIN_URL ||
    (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/login` : "/login");

  const webhookUrl = process.env.TIER2_ACCESS_EMAIL_WEBHOOK;
  let emailSentVia = "none";

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tier2_access_granted",
          email,
          loginUrl,
          code: tier2Code || undefined,
        }),
      });
      emailSentVia = "webhook";
    } catch (err) {
      console.error("tier2-request approve webhook error", err);
      return NextResponse.json(
        { error: "Request approved, but email webhook failed. Check server logs." },
        { status: 500 }
      );
    }
  } else if (process.env.TIER2_EMAIL_FROM) {
    // Fallback: lokale Postfix via sendmail, gebruikmakend van TIER2_EMAIL_FROM als afzender.
    const from = process.env.TIER2_EMAIL_FROM;
    const subject = "Je KapitaalBot Tier 2-toegangscode";
    const lines = [
      `From: ${from}`,
      `To: ${email}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      "Je aanvraag voor Tier 2-toegang tot de KapitaalBot-observability dashboards is goedgekeurd.",
      "",
      `Je kunt inloggen via: ${loginUrl}`,
      tier2Code ? `Je toegangscode is: ${tier2Code}` : "",
      "",
      "Bewaar deze code veilig. Als je vragen hebt, neem contact op via info@kapitaalbot.nl.",
      "",
      "Groet,",
      "KapitaalBot",
      "",
    ]
      .filter((l) => l !== "")
      .join("\n");

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
      emailSentVia = "local-sendmail";
    } catch (err) {
      console.error("tier2-request approve sendmail error", err);
      // We geven hier geen 500 terug; aanvraag is goedgekeurd maar e-mail is mislukt.
      emailSentVia = "sendmail-error";
    }
  }

  return NextResponse.json({
    ok: true,
    email,
    status: "approved",
    emailWebhookUsed: Boolean(webhookUrl),
    emailSentVia,
  });
}

