/**
 * Auth placeholder (Phase 6). Simple session auth; tier-aware.
 * Tier 2: handmatig toegekend; Tier 3: admin.
 * BFF middleware moet sessie → tier mappen; 403 bij te lage tier voor resource.
 */

export type Tier = 1 | 2 | 3;

/** Placeholder: geen echte sessie. Na implementatie: cookie + server-side session store. */
export function getSessionTier(): Tier {
  // TODO: read from session cookie / token
  return 1;
}

export function requireTier(minTier: Tier): boolean {
  return getSessionTier() >= minTier;
}
