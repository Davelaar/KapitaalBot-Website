"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";
import { stripLocalePathname, withLocale } from "@/lib/locale-path";

function FlagNL() {
  /* NL: rood (boven), wit (midden), blauw (onder) */
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" style={{ width: "100%", height: "100%", display: "block" }}>
      <path fill="#AE1C28" d="M0 0h9v2H0z" />
      <path fill="#FFF" d="M0 2h9v2H0z" />
      <path fill="#21468B" d="M0 4h9v2H0z" />
    </svg>
  );
}

function FlagEN() {
  /* UK: blauw veld + rood kruis van St George (wit rand, rood midden) */
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ width: "100%", height: "100%", display: "block" }}>
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path fill="#FFF" d="M25 0h10v30h-10zM0 10h60v10H0z" />
      <path fill="#C8102E" d="M27 0h6v30h-6zM0 12h60v6H0z" />
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
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const setLocale = useCallback(
    (locale: Locale) => {
      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("language_switch");
      }
      const rest = stripLocalePathname(pathname);
      const target = withLocale(locale, rest);
      document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
      router.push(target);
    },
    [router, pathname],
  );

  return (
    <span
      style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
      role="group"
      aria-label={
        currentLocale === "en"
          ? "Choose language"
          : currentLocale === "de"
            ? "Sprache wählen"
            : currentLocale === "fr"
              ? "Choisir la langue"
              : "Taal kiezen"
      }
    >
      {locales.map((locale) => {
        const Icon = FLAG_ICON[locale];
        return (
          <button
            key={locale}
            type="button"
            onClick={() => setLocale(locale)}
            aria-label={locale === "nl" ? "Nederlands" : locale === "en" ? "English" : locale === "de" ? "Deutsch" : "Français"}
            title={locale === "nl" ? "Nederlands" : locale === "en" ? "English" : locale === "de" ? "Deutsch" : "Français"}
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
