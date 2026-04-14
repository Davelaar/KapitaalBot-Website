import fs from "fs";
import path from "path";

import { getSessionTier } from "@/lib/auth";
import { getCanonicalDocsDirForIndexing } from "@/lib/docs-filesystem";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Tier = 1 | 2 | 3;

type DocMeta = {
  slug: string;
  status: string;
  content: string;
};

const CANONICAL_DOCS_DIR = getCanonicalDocsDirForIndexing();
const DOC_INDEX_PATH = path.join(CANONICAL_DOCS_DIR, "DOC_INDEX.md");

let cache: {
  loaded: boolean;
  docs: DocMeta[];
  statusBySlug: Record<string, string>;
} = { loaded: false, docs: [], statusBySlug: {} };

function stripCodeAndBackticks(text: string): string {
  const noFences = text.replace(/```[\s\S]*?```/g, "");
  return noFences.replace(/`/g, "");
}

function extractSnippet(text: string, keywords: string[], maxChars = 560): string {
  const clean = stripCodeAndBackticks(text);
  const lower = clean.toLowerCase();
  const idxs = keywords
    .map((k) => lower.indexOf(k))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  const start = idxs.length ? Math.max(0, idxs[0] - 240) : 0;
  const snippet = clean.slice(start, start + maxChars);
  return snippet.replace(/\s+/g, " ").trim();
}

function parseDocIndex(): Record<string, string> {
  if (!fs.existsSync(DOC_INDEX_PATH)) return {};
  const raw = fs.readFileSync(DOC_INDEX_PATH, "utf-8");
  const lines = raw.split(/\r?\n/);
  const statusBySlug: Record<string, string> = {};
  for (const line of lines) {
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
  if (!fs.existsSync(CANONICAL_DOCS_DIR)) {
    cache.loaded = true;
    return;
  }
  const statusBySlug = parseDocIndex();
  const files = fs.readdirSync(CANONICAL_DOCS_DIR).filter((f) => f.endsWith(".md"));
  const docs: DocMeta[] = [];
  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    const content = fs.readFileSync(path.join(CANONICAL_DOCS_DIR, f), "utf-8");
    const status = statusBySlug[slug] ?? "UNKNOWN";
    docs.push({ slug, status, content });
  }
  cache = { loaded: true, docs, statusBySlug };
}

/** Woorden ≥3 tekens; houdt Duitse/Franse termen beter vast. */
function tokenize(question: string): string[] {
  const q = question.toLowerCase();
  return Array.from(new Set(q.split(/[^a-z0-9_äöüßéèêëàâîïôûùç]+/i).filter((t) => t.length >= 3)));
}

function scoreDoc(questionTokens: string[], doc: DocMeta): number {
  if (!questionTokens.length) return 0;
  const contentLower = doc.content.toLowerCase();
  const slugLower = doc.slug.toLowerCase();
  let score = 0;
  const head = contentLower.slice(0, 2500);
  for (const kw of questionTokens) {
    if (!kw) continue;
    if (slugLower.includes(kw)) score += 4;
    if (head.includes(kw)) score += 3;
    else if (contentLower.includes(kw)) score += 1;
  }
  return score;
}

/** Minimum score om een doc-fragment als antwoord te tonen (na lokale FAQ). */
const MIN_DOC_SCORE = 4;

export async function retrieveFaqFromDocs(
  question: string,
  locale: Locale,
): Promise<{
  candidate: string;
  sources: string[];
  bestScore: number;
}> {
  const tier = (await getSessionTier()) as Tier;
  loadDocCache();
  const tokens = tokenize(question);

  const allowed =
    tier >= 2
      ? cache.docs.filter((d) => !/SUPERSEDED|ARCHIVE —|ARCHIVE\/|superseded\/|archive\//i.test(d.content.slice(0, 300)))
      : cache.docs.filter((d) => d.status === "SSOT" || d.status === "CURRENT");

  const scored = allowed
    .map((d) => ({ doc: d, score: scoreDoc(tokens, d) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const bestScore = best?.score ?? 0;
  const top = scored.slice(0, 3).filter((x) => x.score > 0);

  if (!best || bestScore < MIN_DOC_SCORE) {
    return {
      candidate: t(locale, "faq.chat.docRetrievalNoMatch"),
      sources: [],
      bestScore,
    };
  }

  const snippet = extractSnippet(best.doc.content, tokens.slice(0, 12));
  const prefix = t(locale, "faq.chat.docExtractPrefix");

  return {
    candidate: `${prefix}\n\n${snippet}`,
    sources: top.map((x) => x.doc.slug),
    bestScore,
  };
}
