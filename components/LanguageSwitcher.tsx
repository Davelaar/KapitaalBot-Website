"use client";

import { useCallback } from "react";
import { locales, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
  de: "DE",
  fr: "FR",
};

export function LanguageSwitcher() {
  const setLocale = useCallback((locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }, []);

  return (
    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.85rem" }}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setLocale(locale)}
          aria-label={`Taal: ${LABELS[locale]}`}
          style={{
            padding: "0.2rem 0.4rem",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            background: "var(--card-bg)",
            color: "var(--fg)",
            cursor: "pointer",
          }}
        >
          {LABELS[locale]}
        </button>
      ))}
    </span>
  );
}
