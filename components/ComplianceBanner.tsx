"use client";

/**
 * Verplichte crypto-waarschuwing (sectie 19). Altijd onderaan, wit, donkere tekst.
 * Niet meenemen in dark theme. CMS-light overschrijfbaar; fallback hier.
 */
const DEFAULT_TEXT =
  "Handelen in cryptovaluta brengt aanzienlijke risico's met zich mee. Verlies van uw inleg is mogelijk. Dit platform is uitsluitend informatief en vormt geen beleggingsadvies of -aanbod.";

export default function ComplianceBanner({
  text,
}: {
  text?: string | null;
}) {
  const content = text && text.trim() ? text : DEFAULT_TEXT;
  return (
    <aside
      className="compliance-banner"
      role="note"
      aria-label="Crypto risk warning"
    >
      <div className="compliance-banner__inner">{content}</div>
    </aside>
  );
}
