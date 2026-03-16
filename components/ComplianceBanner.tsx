"use client";

import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function ComplianceBanner({
  text,
}: {
  text?: string | null;
}) {
  const locale = useLocale();

  const content = text && text.trim() ? text : t(locale, "compliance.default");
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
