/** Indexable kennis / SEO pillar pages under /kennis/[slug] */
export const KENNIS_SLUGS = [
  "kraken-l3-orderbook-bot",
  "kraken-websocket-api-spot",
  "kraken-hybrid-maker-fees",
  "crypto-regime-detectie",
  "live-execution-transparency",
  "veilige-kraken-api-bot",
  "low-latency-crypto-execution-nl",
] as const;

export type KennisSlug = (typeof KENNIS_SLUGS)[number];

export function isKennisSlug(s: string): s is KennisSlug {
  return (KENNIS_SLUGS as readonly string[]).includes(s);
}
