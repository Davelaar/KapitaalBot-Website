import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { getSessionTier } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { matchLocalFaq } from "@/lib/faq-local-fallback";

function parseLocale(raw: string): Locale {
  if (raw === "en" || raw === "de" || raw === "fr") return raw;
  return "nl";
}

/**
 * FAQ endpoint (website) -> externe RAG backend.
 * Primair contract: POST FAQ_CHAT_BACKEND_URL (/rag/faq).
 * Alleen logging blijft lokaal in deze route.
 */

async function logFaq(question: string, answer: string, sources: string[]) {
  try {
    const dir = path.join(process.cwd(), "data");
    const file = path.join(dir, "faq_logs.json");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const entry = {
      ts: new Date().toISOString(),
      question,
      answer: answer.slice(0, 1000),
      sources,
    };
    let current: any[] = [];
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf8");
      current = JSON.parse(raw);
    }
    current.push(entry);
    fs.writeFileSync(file, JSON.stringify(current.slice(-500), null, 2), "utf8");
  } catch {
    // logging is best-effort; fouten hier mogen de API niet breken
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const locale = parseLocale(typeof body?.locale === "string" ? body.locale : "nl");
  if (!question) {
    return NextResponse.json({ error: "Vraag ontbreekt." }, { status: 400 });
  }

  const backendUrl = process.env.FAQ_CHAT_BACKEND_URL?.trim();
  if (!backendUrl) {
    const local = matchLocalFaq(question, locale);
    if (local) {
      await logFaq(question, local.answer, local.sources);
      return NextResponse.json({
        answer: local.answer,
        sources: local.sources,
        mode: "local_faq" as const,
      });
    }
    const fallbackMsg = t(locale, "faq.chat.fallbackNoMatch");
    await logFaq(question, fallbackMsg, []);
    return NextResponse.json({
      answer: fallbackMsg,
      sources: [],
      mode: "local_faq" as const,
    });
  }

  const tierNum = await getSessionTier();
  const tier = tierNum >= 3 ? "admin" : tierNum >= 2 ? "tier2" : "tier1";

  let finalAnswer = "";
  let sources: string[] = [];
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, locale, tier }),
    });
    if (!resp.ok) {
      const raw = await resp.text();
      throw new Error(`RAG backend error (${resp.status}): ${raw.slice(0, 240)}`);
    }
    const json = await resp.json();
    finalAnswer = String(json?.answer || "").trim();
    const rawSources = Array.isArray(json?.sources) ? json.sources : [];
    sources = rawSources
      .map((s: any) => (typeof s?.doc_path === "string" ? s.doc_path : ""))
      .filter((s: string) => s.length > 0);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "RAG backend niet bereikbaar." },
      { status: 503 }
    );
  }

  await logFaq(question, finalAnswer, sources);

  return NextResponse.json({
    answer: finalAnswer,
    sources,
    mode: "rag" as const,
  });
}

