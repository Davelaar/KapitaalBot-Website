"use client";

import { useEffect, useState } from "react";
import { t, defaultLocale, type Locale } from "@/lib/i18n";

function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  const value = match?.[1] as Locale | undefined;
  if (value && ["nl", "en", "de", "fr"].includes(value)) return value;
  return defaultLocale;
}

export default function ComplianceBanner({
  text,
}: {
  text?: string | null;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(getLocaleFromCookie());
  }, []);

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
