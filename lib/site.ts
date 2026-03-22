/**
 * Canonical site URL for metadata, sitemap, and JSON-LD.
 * Set NEXT_PUBLIC_BASE_URL in production (e.g. https://kapitaalbot.nl).
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://kapitaalbot.nl").replace(/\/+$/, "");
}
