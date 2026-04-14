import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/locale-path";

/**
 * Map engine markdown links (`./OTHER.md`, `#anchor`) to Next routes (`/nl/docs/OTHER#anchor`).
 */
export function resolveDocMarkdownHref(
  raw: string | undefined,
  locale: Locale,
  currentSlug: string
): string {
  const href = (raw ?? "").trim();
  if (!href) return withLocale(locale, `/docs/${currentSlug}`);

  if (/^(https?:|mailto:|\/\/)/i.test(href)) return href;

  const hashIdx = href.indexOf("#");
  const pathPart = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";

  if (!pathPart) {
    return `${withLocale(locale, `/docs/${currentSlug}`)}${hash}`;
  }

  let clean = pathPart.replace(/^\.\//, "").trim();
  const base = clean.includes("/") ? clean.split("/").pop() ?? clean : clean;
  let slug = base;
  if (slug.endsWith(".md")) slug = slug.slice(0, -3);
  if (!slug) return `${withLocale(locale, `/docs/${currentSlug}`)}${hash}`;

  return `${withLocale(locale, `/docs/${slug}`)}${hash}`;
}

export function isExternalDocHref(raw: string | undefined): boolean {
  const href = (raw ?? "").trim();
  return /^(https?:|mailto:|\/\/)/i.test(href);
}
