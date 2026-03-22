import { type Locale, defaultLocale, locales } from "@/lib/i18n";

export function isLocale(s: string): s is Locale {
  return locales.includes(s as Locale);
}

/** Pad zonder leading locale, altijd met leading slash (bv. `/dashboard`, `/`). */
export function stripLocalePathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/** Intern pad → URL met locale-segment. `path` is `/foo` of `foo`. */
export function withLocale(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return `/${locale}`;
  return `/${locale}${p}`;
}

export function parseLocaleParam(raw: string | undefined): Locale {
  if (raw && isLocale(raw)) return raw;
  return defaultLocale;
}

/** `next` query na login: pad kan al een locale hebben of niet — altijd `/{locale}/...`. */
export function resolveNextWithLocale(locale: Locale, rawNext: string | null | undefined): string {
  const fallback = "/dashboard/tier2";
  const raw = rawNext ?? fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return withLocale(locale, stripLocalePathname(fallback));
  }
  return withLocale(locale, stripLocalePathname(raw));
}
