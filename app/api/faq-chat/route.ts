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
 * FAQ-antwoordketen (één contract voor zoekbalk + chat):
 * 1) Lokale FAQ (zelfde Q/A als /faq)
 * 2) Fragment uit gesyncte engine-docs
 * 3) RAG-backend (als FAQ_CHAT_BACKEND_URL gezet is)
 * 4) Eerlijk “weet ik niet” / geen match
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

  const backendUrl = process.env.FAQ_CHAT_BACKEND_URL?.trim();
  if (backendUrl) {
    const tierNum = await getSessionTier();
    const tier = tierNum >= 3 ? "admin" : tierNum >= 2 ? "tier2" : "tier1";

    try {
      const resp = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale, tier }),
      });

      if (resp.ok) {
        const json = (await resp.json()) as { answer?: string; sources?: unknown[] };
        const finalAnswer = String(json?.answer || "").trim();
        const rawSources = Array.isArray(json?.sources) ? json.sources : [];
        const sources = rawSources
          .map((s: unknown) => {
            if (typeof s === "object" && s !== null && "doc_path" in s && typeof (s as { doc_path: string }).doc_path === "string") {
              return (s as { doc_path: string }).doc_path;
            }
            return "";
          })
          .filter((s: string) => s.length > 0);
        await logFaq(question, finalAnswer, sources);
        return NextResponse.json({
          answer: finalAnswer || t(locale, "faq.chat.unknownHonest"),
          sources,
          mode: "rag" as const,
        });
      }

      if (resp.status === 404) {
        const honest = t(locale, "faq.chat.unknownHonest");
        await logFaq(question, honest, []);
        return NextResponse.json({
          answer: honest,
          sources: [],
          mode: "rag_no_chunks" as const,
        });
      }

      const unavailable = t(locale, "faq.chat.ragUnavailable");
      await logFaq(question, unavailable, []);
      return NextResponse.json({
        answer: unavailable,
        sources: [],
        mode: "rag_unavailable" as const,
      });
    } catch {
      const unavailable = t(locale, "faq.chat.ragUnavailable");
      await logFaq(question, unavailable, []);
      return NextResponse.json({
        answer: unavailable,
        sources: [],
        mode: "rag_unavailable" as const,
      });
    }
  }

  const fallbackMsg = t(locale, "faq.chat.unknownHonest");
  await logFaq(question, fallbackMsg, []);
  return NextResponse.json({
    answer: fallbackMsg,
    sources: [],
    mode: "unknown" as const,
  });
}
