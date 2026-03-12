"use client";

import { useCallback } from "react";
import { locales, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

function FlagNL() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" style={{ width: "100%", height: "100%", display: "block" }}>
      <path fill="#AE1C28" d="M0 0h9v6H0z" />
      <path fill="#FFF" d="M0 0h9v4H0z" />
      <path fill="#21468B" d="M0 0h9v2H0z" />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ width: "100%", height: "100%", display: "block" }}>
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path fill="none" stroke="#FFF" strokeWidth="6" d="M0 0l60 30M60 0L0 30" />
      <path fill="none" stroke="#FFF" strokeWidth="4" d="M0 0l60 30M60 0L0 30" transform="scale(0.5)" />
      <path fill="none" stroke="#C8102E" strokeWidth="10" d="M30 0v30M0 15h60" />
      <path fill="none" stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" transform="scale(0.5)" />
    </svg>
  );
}

function FlagDE() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" style={{ width: "100%", height: "100%", display: "block" }}>
      <path fill="#000" d="M0 0h5v3H0z" />
      <path fill="#D00" d="M0 1h5v2H0z" />
      <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>
  );
}

function FlagFR() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" style={{ width: "100%", height: "100%", display: "block" }}>
      <path fill="#002395" d="M0 0h1v2H0z" />
      <path fill="#FFF" d="M1 0h1v2H1z" />
      <path fill="#ED2939" d="M2 0h1v2H2z" />
    </svg>
  );
}

const FLAG_ICON: Record<Locale, () => JSX.Element> = {
  nl: FlagNL,
  en: FlagEN,
  de: FlagDE,
  fr: FlagFR,
};

export function LanguageSwitcher() {
  const setLocale = useCallback((locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }, []);

  return (
    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }} role="group" aria-label="Taal kiezen">
      {locales.map((locale) => {
        const Icon = FLAG_ICON[locale];
        return (
          <button
            key={locale}
            type="button"
            onClick={() => setLocale(locale)}
            aria-label={LABELS[locale]}
            title={LABELS[locale]}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 20,
              padding: 0,
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--card-bg)",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <Icon />
          </button>
        );
      })}
    </span>
  );
}
