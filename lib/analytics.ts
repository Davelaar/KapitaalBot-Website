/**
 * GA4 via `public/analytics/kapitaalbot-analytics.js` (consent overlay, NL/EN/DE/FR).
 * Used when Plausible and Umami are not configured.
 *
 * - `NEXT_PUBLIC_GA_DISABLE=1` — no GA
 * - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — override default `G-TLP1NT0CYH`
 */
export function getKapitaalbotGaMeasurementId(): string | null {
  if (
    process.env.NEXT_PUBLIC_GA_DISABLE === "1" ||
    process.env.NEXT_PUBLIC_GA_DISABLE === "true"
  ) {
    return null;
  }
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) return null;
  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null;

  const fromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (fromEnv === "" || fromEnv === "false") return null;
  return fromEnv || "G-TLP1NT0CYH";
}
