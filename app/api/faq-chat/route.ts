import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { getSessionTier } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { matchLocalFaq } from "@/lib/faq-local-fallback";
import { retrieveFaqFromDocs } from "@/lib/faq-retrieval";

function parseLocale(raw: string): Locale {
  if (raw === "en" || raw === "de" || raw === "fr") return raw;
  return "nl";
}

/**
 * FAQ endpoint (website) -> externe RAG backend.
 * Primair contract: POST FAQ_CHAT_BACKEND_URL (/rag/faq).
 * Zonder backend: lokale FAQ-match → fragment uit engine-docs → i18n-fallback (taal = UI-locale).
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
    let current: unknown[] = [];
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf8");
      current = JSON.parse(raw) as unknown[];
    }
    current.push(entry);
    fs.writeFileSync(file, JSON.stringify(current.slice(-500), null, 2), "utf8");
  } catch {
    /* best-effort */
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const locale = parseLocale(typeof body?.locale === "string" ? body.locale : "nl");
  if (!question) {
    return NextResponse.json({ error: t(locale, "faq.chat.questionRequired") }, { status: 400 });
  }

  const backendUrl = process.env.FAQ_CHAT_BACKEND_URL?.trim();
  if (!backendUrl) {
    const local = matchLocalFaq(question, locale);
    if (local?.answer) {
      await logFaq(question, local.answer, local.sources);
      return NextResponse.json({
        answer: local.answer,
        sources: local.sources,
        mode: "local_faq" as const,
      });
    }

    const docHit = await retrieveFaqFromDocs(question, locale);
    if (docHit.bestScore >= 4 && docHit.sources.length > 0 && docHit.candidate.length > 40) {
      await logFaq(question, docHit.candidate, docHit.sources);
      return NextResponse.json({
        answer: docHit.candidate,
        sources: docHit.sources,
        mode: "doc_snippet" as const,
      });
    }

    const fallbackMsg = t(locale, "faq.chat.fallbackNoMatch");
    await logFaq(question, fallbackMsg, []);
    return NextResponse.json({
      answer: fallbackMsg,
      sources: [],
      mode: "fallback" as const,
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
    const json = (await resp.json()) as { answer?: string; sources?: unknown[] };
    finalAnswer = String(json?.answer || "").trim();
    const rawSources = Array.isArray(json?.sources) ? json.sources : [];
    sources = rawSources
      .map((s: unknown) => {
        if (typeof s === "object" && s !== null && "doc_path" in s && typeof (s as { doc_path: string }).doc_path === "string") {
          return (s as { doc_path: string }).doc_path;
        }
        return "";
      })
      .filter((s: string) => s.length > 0);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "RAG backend niet bereikbaar.";
    return NextResponse.json({ error: msg }, { status: 503 });
  }

  await logFaq(question, finalAnswer, sources);

  return NextResponse.json({
    answer: finalAnswer,
    sources,
    mode: "rag" as const,
  });
}
