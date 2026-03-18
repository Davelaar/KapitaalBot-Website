import fs from "fs";
import path from "path";

import { getSessionTier } from "@/lib/auth";

type Tier = 1 | 2 | 3;
type Language = "nl" | "en" | "de" | "fr";

type DocMeta = {
  slug: string; // without .md
  status: string; // DOC_STATUS from DOC_INDEX if known
  content: string;
};

const DOCS_DIR = path.join(process.cwd(), "content", "docs");
const DOC_INDEX_PATH = path.join(DOCS_DIR, "DOC_INDEX.md");

let cache: {
  loaded: boolean;
  docs: DocMeta[];
  statusBySlug: Record<string, string>;
} = { loaded: false, docs: [], statusBySlug: {} };

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function detectLanguage(question: string): Language {
  const q = question.toLowerCase();
  // Extremely lightweight heuristics (good enough for a UI fallback).
  if (/(what|difference|between|how does|tier 1|tier 2|tier 3|risk warning)/.test(q)) return "en";
  if (/(was ist|unterschied|zwischen|wie funktioniert|risiko|tier 1|tier 2|tier 3)/.test(q)) return "de";
  if (/(quelle|diff[ée]rence|entre|comment fonctionne|avertissement|risque|tier 1|tier 2|tier 3)/.test(q)) return "fr";
  return "nl";
}

function stripCodeAndBackticks(text: string): string {
  // Remove triple-backtick blocks.
  const noFences = text.replace(/```[\s\S]*?```/g, "");
  // Remove inline backticks.
  return noFences.replace(/`/g, "");
}

function extractSnippet(text: string, keywords: string[], maxChars = 520): string {
  const clean = stripCodeAndBackticks(text);
  const lower = clean.toLowerCase();
  const idxs = keywords
    .map((k) => lower.indexOf(k))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  const start = idxs.length ? Math.max(0, idxs[0] - 220) : 0;
  const snippet = clean.slice(start, start + maxChars);
  return snippet.replace(/\s+/g, " ").trim();
}

function parseDocIndex(): Record<string, string> {
  if (!fs.existsSync(DOC_INDEX_PATH)) return {};
  const raw = fs.readFileSync(DOC_INDEX_PATH, "utf-8");
  const lines = raw.split(/\r?\n/);
  const statusBySlug: Record<string, string> = {};
  for (const line of lines) {
    // Table rows look like: | ENGINE_SSOT.md | SSOT | ...
    const parts = line
      .split("|")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length < 2) continue;
    const maybeFile = parts[0];
    const maybeStatus = parts[1];
    if (!maybeFile.endsWith(".md")) continue;
    if (!maybeStatus) continue;
    const slug = maybeFile.replace(/\.md$/, "");
    statusBySlug[slug] = maybeStatus;
  }
  return statusBySlug;
}

function loadDocCache(): void {
  if (cache.loaded) return;
  if (!fs.existsSync(DOCS_DIR)) {
    cache.loaded = true;
    return;
  }
  const statusBySlug = parseDocIndex();
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
  const docs: DocMeta[] = [];
  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    const content = fs.readFileSync(path.join(DOCS_DIR, f), "utf-8");
    const status = statusBySlug[slug] ?? "UNKNOWN";
    docs.push({ slug, status, content });
  }
  cache = { loaded: true, docs, statusBySlug };
}

function tokenize(question: string): string[] {
  const q = question.toLowerCase();
  return Array.from(new Set(q.split(/[^a-z0-9_]+/).filter((t) => t.length >= 5)));
}

function scoreDoc(questionTokens: string[], doc: DocMeta): number {
  const q = normalize(questionTokens.join(" "));
  if (!q) return 0;
  const titleBoost = doc.slug.toLowerCase();
  const titleScore = titleBoost.includes(q) ? 2 : 0;
  const contentLower = doc.content.toLowerCase();
  let score = titleScore;
  const firstPart = contentLower.slice(0, 2000);
  for (const kw of questionTokens) {
    if (!kw) continue;
    if (doc.slug.toLowerCase().includes(kw)) score += 3;
    if (contentLower.includes(kw)) score += 1;
    if (firstPart.includes(kw)) score += 2;
  }
  return score;
}

function friendlyAnswerPrefix(lang: Language): string {
  if (lang === "en") return "From the KapitaalBot documentation, in high level:";
  if (lang === "de") return "Aus der KapitaalBot-Dokumentation, auf hoher Ebene:";
  if (lang === "fr") return "D’après la documentation KapitaalBot, au niveau conceptuel:";
  return "Op basis van KapitaalBot-documentatie (in hoofdlijnen):";
}

export async function retrieveFaqFromDocs(question: string): Promise<{
  candidate: string;
  sources: string[];
  bestScore: number;
}> {
  const tier = (await getSessionTier()) as Tier;
  loadDocCache();
  const lang = detectLanguage(question);
  const tokens = tokenize(question);

  const allowed =
    tier >= 2
      ? cache.docs.filter((d) => !/SUPERSEDED|ARCHIVE —|ARCHIVE\/|superseded\/|archive\//i.test(d.content.slice(0, 300)))
      : cache.docs.filter((d) => d.status === "SSOT" || d.status === "CURRENT");

  const scored = allowed
    .map((d) => ({ doc: d, score: scoreDoc(tokens, d) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3);
  const best = top[0];
  const bestScore = best?.score ?? 0;
  const sources = top.filter((t) => t.score > 0).map((t) => t.doc.slug);

  if (!best || bestScore <= 0) {
    if (lang === "en") {
      return {
        candidate:
          "I don’t have a confident match in the public/current documentation for your exact wording. Try rephrasing the question or browse the SSOT and CURRENT docs via /docs.",
        sources: [],
        bestScore,
      };
    }
    if (lang === "de") {
      return {
        candidate:
          "Ich finde keine sichere Übereinstimmung in den public/current Dokumenten. Bitte die Frage umformulieren oder die SSOT/CURRENT-Dokumente über /docs ansehen.",
        sources: [],
        bestScore,
      };
    }
    if (lang === "fr") {
      return {
        candidate:
          "Je ne trouve pas de correspondance fiable dans la documentation publique/actuelle. Reformulez la question ou consultez les docs SSOT/CURRENT via /docs.",
        sources: [],
        bestScore,
      };
    }
    return {
      candidate:
        "Ik vind geen betrouwbare match in de publieke/actuele documentatie op basis van je formulering. Probeer het anders te formuleren of bekijk de SSOT/CURRENT-docs via /docs.",
      sources: [],
      bestScore,
    };
  }

  const snippet = extractSnippet(best.doc.content, tokens.slice(0, 8));
  const prefix = friendlyAnswerPrefix(lang);

  return {
    candidate: `${prefix}\n\n${snippet}`,
    sources: sources.length ? sources : [best.doc.slug],
    bestScore,
  };
}

