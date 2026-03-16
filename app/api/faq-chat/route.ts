import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * FAQ endpoint met eenvoudige RAG-light:
 * - Kleine knowledge base (KB) met kernantwoorden.
 * - Optioneel: OpenAI RAG-light als OPENAI_API_KEY is gezet.
 * - Logt vragen/antwoorden in data/faq_logs.json (geen PII, alleen tekst).
 *
 * Belangrijke constraints:
 * - Geen letterlijke code of copy/pastebare strategieën delen.
 * - Uitleg altijd in hoofdlijnen, tier-aware, multi-regime/multi-strategy,
 *   maar zonder thresholds of recipes.
 */

const KB: { id: string; q: string; a: string; keywords: string[] }[] = [
  {
    id: "what-is-kapitaalbot",
    q: "Wat is KapitaalBot?",
    a: "KapitaalBot is een autonoom crypto trading systeem met multi-regime en multi-strategy execution. De observability-website toont alleen vertraagde, geaggregeerde read-model snapshots (JSON) over de runtime; geen realtime orders of signals.",
    keywords: ["kapitaalbot", "wat", "engine", "multi-regime", "multi-strategy"],
  },
  {
    id: "tiers",
    q: "Wat is het verschil tussen Tier 1 en Tier 2?",
    a: "Tier 1 is publiek: statusstrip, regimes, strategieën, handelstellers, market/pair summary en demo trades op basis van public_* snapshots. Tier 2 is op aanvraag: extra modules zoals execution- en latencydashboards, uitgebreidere trading-statistieken en shadow-trades. Tier 3 is intern (admin-observability).",
    keywords: ["tier", "tier 1", "tier 2", "tier 3", "publiek", "dashboard"],
  },
  {
    id: "snapshots",
    q: "Waar komt de data op de site vandaan?",
    a: "De bot exporteert observability-snapshots als JSON-bestanden naar een export-directory (OBSERVABILITY_EXPORT_DIR, bijvoorbeeld /srv/krakenbot/observability_export). De website leest alleen deze read-model snapshots (public_status_snapshot.json, public_regime_snapshot.json, public_strategy_snapshot.json, public_market_snapshot.json, public_trading_snapshot.json, public_demo_trades.json).",
    keywords: ["snapshot", "data", "observability_export", "json", "public_status_snapshot", "public_regime_snapshot"],
  },
  {
    id: "risk-warning",
    q: "Is dit financieel advies?",
    a: "Nee. De observability-website is informatief en technisch. Het platform toont de staat van de bot en runtime, maar geeft geen koop- of verkoopadviezen. Crypto is extreem volatiel; sterke koersbewegingen kunnen snel tot grote verliezen leiden.",
    keywords: ["advies", "financieel", "risico", "crypto"],
  },
  {
    id: "engine-ssot",
    q: "Waar vind ik de technische documentatie van de engine?",
    a: "De engine-documentatie leeft in de KRAKENBOTMAART-repository. De kern-SSOT is ENGINE_SSOT.md, met daaronder ARCHITECTURE_ENGINE_CURRENT.md, LIVE_RUNBOOK_CURRENT.md en VALIDATION_MODEL_CURRENT.md voor architectuur, runbook en validatiemodel.",
    keywords: ["documentatie", "engine", "ssot", "architecture", "runbook", "validation"],
  },
];

function score(question: string, entry: (typeof KB)[number]): number {
  const qLower = question.toLowerCase();
  let s = 0;
  for (const kw of entry.keywords) {
    if (qLower.includes(kw)) s += 2;
  }
  // fallback: crude similarity op losse woorden
  const tokens = qLower.split(/\s+/);
  for (const t of tokens) {
    if (t.length > 3 && entry.q.toLowerCase().includes(t)) s += 1;
  }
  return s;
}

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
  if (!question) {
    return NextResponse.json({ error: "Vraag ontbreekt." }, { status: 400 });
  }

  let best = KB[0];
  let bestScore = score(question, KB[0]);
  for (let i = 1; i < KB.length; i++) {
    const s = score(question, KB[i]);
    if (s > bestScore) {
      best = KB[i];
      bestScore = s;
    }
  }

  const kbAnswer =
    bestScore === 0
      ? "Ik heb geen exact antwoord in mijn kleine knowledge base. Probeer het anders te formuleren of bekijk de SSOT- en CURRENT-docs in de KRAKENBOTMAART-repository."
      : best.a;

  // Gebruik primair OPENAI_API_KEY; val desnoods terug op DOCS_EMBEDDING_API_KEY
  // zodat bestaande server-env hergebruikt kan worden.
  const apiKey = process.env.OPENAI_API_KEY || process.env.DOCS_EMBEDDING_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

  let finalAnswer = kbAnswer;
  const sources = [best.id];

  if (apiKey) {
    try {
      const systemPrompt =
        "Je bent een uitleg-bot voor KapitaalBot (autonome crypto trading engine). " +
        "Leg alles uit in hoofdlijnen, conceptueel, multi-regime en multi-strategy, " +
        "maar geef NOOIT letterlijke code, algoritmes, thresholds of recepten. " +
        "Gebruik alleen beschrijvende taal, geen copy/pastebare trading rules. " +
        "Respecteer tiers: Tier 1 toont alleen publieke snapshots; Tier 2/3 mogen als concept beschreven worden, " +
        "maar nooit met signal-niveau details. Antwoord altijd in dezelfde taal als de vraag (NL/EN/DE/FR).";

      const userPrompt =
        `Vraag van gebruiker:\n` +
        question +
        `\n\nBeschikbare kennis uit een interne FAQ-entry:\n` +
        `Q: ${best.q}\nA: ${best.a}\n\n` +
        `Gebruik deze kennis als context, maar je mag ook aanvullende uitleg geven ` +
        `op basis van je eigen begrip van multi-regime/multi-strategy engines, zolang je geen code of exacte tradingregels prijsgeeft.`;

      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
        }),
      });

      if (resp.ok) {
        const json = await resp.json();
        const content =
          json.choices?.[0]?.message?.content?.toString().trim() || "";
        if (content) {
          finalAnswer = content;
        }
      }
    } catch {
      // Bij fout: val terug op kbAnswer zonder error naar gebruiker
    }
  }

  await logFaq(question, finalAnswer, sources);

  return NextResponse.json({
    answer: finalAnswer,
    sources,
  });
}

