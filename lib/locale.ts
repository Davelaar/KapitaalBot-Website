"use client";

import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import type { Locale } from "./i18n";
import { defaultLocale } from "./i18n";
import { isLocale } from "./locale-path";

export function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  const value = match?.[1] as Locale | undefined;
  if (value && ["nl", "en", "de", "fr"].includes(value)) return value;
  return defaultLocale;
}

/**
 * Huidige UI-taal: primair uit URL (`/nl/...`), anders cookie (tijdens transitie).
 */
export function useLocale(): Locale {
  const pathname = usePathname();
  const [cookieLocale, setCookieLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setCookieLocale(getLocaleFromCookie());
    const handler = () => setCookieLocale(getLocaleFromCookie());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  return useMemo(() => {
    const first = pathname.split("/").filter(Boolean)[0];
    if (first && isLocale(first)) return first;
    return cookieLocale;
  }, [pathname, cookieLocale]);
}

/** Server: pad zonder locale — voor redirects (niet in RSC zonder next/headers). */
export function getLocaleFromPathnameOnly(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}
