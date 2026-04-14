/**
 * Lokale FAQ-match (zonder RAG-backend): overlap op dezelfde Q/A als op /faq,
 * plus lichte domein-synoniemen. Antwoordtaal = UI-locale via `t()`.
 */

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { FAQ_SECTION_PRIMARY_DOC, FAQ_SECTIONS } from "@/lib/faq-sections";

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

/** Extra termen bij onderwerp-signalen in de vraag (alle locales). */
function expandFromQuestion(questionLower: string): Set<string> {
  const extra = new Set<string>();
  if (/tier\s*1|tier1|\bt1\b/i.test(questionLower)) {
    extra.add("tier");
    extra.add("1");
  }
  if (/tier\s*2|tier2|\bt2\b/i.test(questionLower)) {
    extra.add("tier");
    extra.add("2");
  }
  if (/tier\s*3|tier3|\bt3\b/i.test(questionLower)) {
    extra.add("tier");
    extra.add("3");
  }
  if (/websocket|web\s*socket|ws\b/i.test(questionLower)) {
    extra.add("websocket");
    extra.add("websockets");
  }
  if (/ingest|ingestie|datafeed|feed/i.test(questionLower)) {
    extra.add("ingest");
    extra.add("data");
  }
  if (/decision|beslis|execution|order|fill/i.test(questionLower)) {
    extra.add("execution");
    extra.add("orders");
  }
  if (/safety|risico|risk|blocked|block/i.test(questionLower)) {
    extra.add("safety");
    extra.add("risk");
  }
  if (/latency|vertraging|delay|ms\b/i.test(questionLower)) {
    extra.add("latency");
  }
  if (/l2|l3|orderbook|order\s*book/i.test(questionLower)) {
    extra.add("l2");
    extra.add("l3");
  }
  if (/advies|advice|investment|beleg/i.test(questionLower)) {
    extra.add("advies");
    extra.add("investment");
  }
  if (/privacy|persoons|personal|account/i.test(questionLower)) {
    extra.add("privacy");
    extra.add("account");
  }
  return extra;
}

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

const MIN_SCORE = 0.11;

export function matchLocalFaq(
  question: string,
  locale: Locale,
): { answer: string; sources: string[] } | null {
  const qTokens = tokenize(question);
  for (const w of expandFromQuestion(question.toLowerCase())) {
    qTokens.add(w);
  }
  if (qTokens.size === 0) return null;

  let bestScore = 0;
  let bestAnswer = "";
  let bestSectionId: string | null = null;

  const qLower = question.toLowerCase().trim();

  for (const section of FAQ_SECTIONS) {
    const titleText = t(locale, section.titleKey);
    const titleTokens = tokenize(titleText);
    for (const { qKey, aKey } of section.items) {
      const qText = t(locale, qKey);
      const aText = t(locale, aKey);
      const docTokens = new Set<string>();
      for (const w of tokenize(qText)) docTokens.add(w);
      for (const w of tokenize(aText)) docTokens.add(w);
      for (const w of titleTokens) docTokens.add(w);

      let intersect = 0;
      for (const w of qTokens) {
        if (docTokens.has(w)) intersect++;
      }
      let score = intersect / Math.max(qTokens.size, 1);

      if (qLower.length >= 4 && qText.toLowerCase().includes(qLower)) {
        score = Math.max(score, 0.92);
      }
      if (qLower.length >= 6 && aText.toLowerCase().includes(qLower)) {
        score = Math.max(score, 0.48);
      }
      if (qLower.length >= 5 && titleText.toLowerCase().includes(qLower)) {
        score = Math.max(score, 0.35);
      }

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = aText;
        bestSectionId = section.id;
      }
    }
  }

  if (bestScore < MIN_SCORE || !bestAnswer || !bestSectionId) return null;
  const docSlug = FAQ_SECTION_PRIMARY_DOC[bestSectionId] ?? "DOC_INDEX";
  return { answer: bestAnswer, sources: [docSlug] };
}
