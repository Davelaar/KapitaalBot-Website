import { NextRequest, NextResponse } from "next/server";

/**
 * Simple retrieval-style FAQ endpoint.
 * In een volgende fase kan dit vervangen worden door echte RAG over de SSOT-docs.
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

  const answer =
    bestScore === 0
      ? "Ik heb geen exact antwoord in mijn kleine knowledge base. Probeer het anders te formuleren of bekijk de SSOT- en CURRENT-docs in de KRAKENBOTMAART-repository."
      : best.a;

  return NextResponse.json({
    answer,
    sources: [best.id],
  });
}

