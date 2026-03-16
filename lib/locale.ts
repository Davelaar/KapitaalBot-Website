"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./i18n";
import { defaultLocale } from "./i18n";

export function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  const value = match?.[1] as Locale | undefined;
  if (value && ["nl", "en", "de", "fr"].includes(value)) return value;
  return defaultLocale;
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  useEffect(() => {
    setLocale(getLocaleFromCookie());
    const handler = () => setLocale(getLocaleFromCookie());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);
  return locale;
}
