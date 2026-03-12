"use client";

/**
 * Verplichte crypto-waarschuwing (AFM-stijl). Altijd onderaan, witte balk, dikgedrukte tekst.
 */
const DEFAULT_TEXT =
  "Crypto is extreem volatiel. Sterke koersbewegingen kunnen snel tot grote verliezen leiden.";

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
      <div className="compliance-banner__inner">
        <strong>{content}</strong>
      </div>
    </aside>
  );
}
