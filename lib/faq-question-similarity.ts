/**
 * Detecteert of twee gebruikersvragen inhoudelijk hetzelfde zijn (sessie-dedup),
 * los van de server-side FAQ-match.
 */

const STOP = new Set([
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
  "the",
  "a",
  "an",
  "is",
  "and",
  "or",
  "what",
  "how",
  "der",
  "das",
  "und",
  "ist",
  "le",
  "la",
  "les",
  "une",
  "un",
]);

function tokens(s: string): Set<string> {
  const words = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set<string>();
  for (const w of words) {
    if (w.length >= 3 && !STOP.has(w)) out.add(w);
  }
  return out;
}

/** Jaccard op woorden + simpele substring-check. */
export function userQuestionsLookSimilar(a: string, b: string): boolean {
  const x = a.trim().toLowerCase();
  const y = b.trim().toLowerCase();
  if (x.length < 4 || y.length < 4) return false;
  if (x === y) return true;
  if (x.length >= 10 && y.length >= 10 && (x.includes(y) || y.includes(x))) return true;

  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return false;
  let inter = 0;
  for (const w of ta) {
    if (tb.has(w)) inter++;
  }
  const union = ta.size + tb.size - inter;
  const j = union > 0 ? inter / union : 0;
  return j >= 0.52;
}
