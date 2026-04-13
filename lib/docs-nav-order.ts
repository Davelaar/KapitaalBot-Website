/**
 * Preferred order for documentation nav (matches engine DOC_INDEX structure).
 * Slugs not listed sort after these, alphabetically.
 */
export const DOCS_NAV_ORDER: string[] = [
  "DOC_INDEX",
  "00_MODULE_INVENTORY",
  "01_ARCHITECTURE",
  "02_DATA_INGEST",
  "03_STRATEGY_PIPELINE",
  "04_EXECUTION_ORDERS",
  "05_PROTECTION_EXIT",
  "06_RISK_SAFETY",
  "07_OBSERVABILITY",
  "08_OPERATIONS",
  "FASE_0B_RUNTIME",
  "DECIMAL_F64_POLICY_AND_INVENTORY",
  "FORWARD_RETURNS_OBSERVABILITY",
  "DOCS_TARGET_STRUCTURE",
  "OBSERVABILITY_SNAPSHOT_CONTRACT",
  "SYSTEMD_README",
];

export function sortDocSlugsForNav(slugs: string[]): string[] {
  const rank = (s: string) => {
    const i = DOCS_NAV_ORDER.indexOf(s);
    return i === -1 ? 1000 : i;
  };
  return [...slugs].sort((a, b) => {
    const d = rank(a) - rank(b);
    return d !== 0 ? d : a.localeCompare(b);
  });
}
