/**
 * Wanneer geen RAG-backend is geconfigureerd: eenvoudige overlap-match tegen
 * dezelfde FAQ-Q/A als op de FAQ-pagina (geen embeddings).
 */

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { FAQ_SECTIONS } from "@/lib/faq-sections";

const STOPWORDS = new Set([
  "de",
  "het",
  "een",
  "van",
  "voor",
  "met",
  "niet",
  "dat",
  "die",
  "wat",
  "hoe",
  "kan",
  "zijn",
  "naar",
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "for",
  "with",
  "without",
  "not",
  "and",
  "or",
  "what",
  "how",
  "can",
  "does",
  "der",
  "das",
  "und",
  "ist",
  "ein",
  "eine",
  "nicht",
  "wie",
  "von",
  "auf",
  "le",
  "la",
  "les",
  "des",
  "une",
  "un",
  "est",
  "pas",
  "et",
  "pour",
  "avec",
  "qui",
]);

function tokenize(s: string): Set<string> {
  const words = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set<string>();
  for (const w of words) {
    if (w.length >= 2 && !STOPWORDS.has(w)) out.add(w);
    else if (/^\d+$/.test(w)) out.add(w);
  }
  return out;
}

const MIN_SCORE = 0.14;

export function matchLocalFaq(
  question: string,
  locale: Locale
): { answer: string; sources: string[] } | null {
  const qTokens = tokenize(question);
  if (qTokens.size === 0) return null;

  let bestScore = 0;
  let bestAnswer = "";

  const qLower = question.toLowerCase().trim();

  for (const section of FAQ_SECTIONS) {
    for (const { qKey, aKey } of section.items) {
      const qText = t(locale, qKey);
      const aText = t(locale, aKey);
      const docTokens = new Set<string>();
      for (const w of tokenize(qText)) docTokens.add(w);
      for (const w of tokenize(aText)) docTokens.add(w);

      let intersect = 0;
      for (const w of qTokens) {
        if (docTokens.has(w)) intersect++;
      }
      let score = intersect / qTokens.size;

      if (qLower.length >= 4 && qText.toLowerCase().includes(qLower)) {
        score = Math.max(score, 0.88);
      }
      if (qLower.length >= 6 && aText.toLowerCase().includes(qLower)) {
        score = Math.max(score, 0.42);
      }

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = aText;
      }
    }
  }

  if (bestScore < MIN_SCORE || !bestAnswer) return null;
  return { answer: bestAnswer, sources: [] };
}
