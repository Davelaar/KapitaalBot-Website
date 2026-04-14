/**
 * On-disk locales for markdown: `nl/` (canonical, synced from bot) and `en/` (English; sync replica).
 * `de/` and `fr/` are optional — add when translations exist; until then `/de/docs/*` and `/fr/docs/*`
 * fall back to `nl/*.md` (see resolveDocMarkdownPath), then legacy flat `content/docs/<slug>.md`.
 */

import fs from "fs";
import path from "path";

import { defaultLocale, type Locale } from "@/lib/i18n";

export const DOCS_CONTENT_ROOT = path.join(process.cwd(), "content", "docs");

/**
 * Slug list from `content/docs/nl/*.md`, or legacy flat `content/docs/*.md` if nl/ is absent.
 */
export function getDocSlugs(): string[] {
  const canonicalDir = path.join(DOCS_CONTENT_ROOT, defaultLocale);
  if (fs.existsSync(canonicalDir)) {
    return fs
      .readdirSync(canonicalDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
      .sort();
  }
  if (!fs.existsSync(DOCS_CONTENT_ROOT)) return [];
  return fs
    .readdirSync(DOCS_CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".md"))
    .map((d) => d.name.replace(/\.md$/, ""))
    .sort();
}

/**
 * Absolute path to the markdown file for this slug and UI locale, or null if missing everywhere.
 */
export function resolveDocMarkdownPath(slug: string, locale: Locale): string | null {
  const candidates = [
    path.join(DOCS_CONTENT_ROOT, locale, `${slug}.md`),
    path.join(DOCS_CONTENT_ROOT, defaultLocale, `${slug}.md`),
    path.join(DOCS_CONTENT_ROOT, `${slug}.md`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** `content/docs/nl`, or legacy flat `content/docs` if `nl/` does not exist yet. */
export function getCanonicalDocsDirForIndexing(): string {
  const nlDir = path.join(DOCS_CONTENT_ROOT, defaultLocale);
  if (fs.existsSync(nlDir)) return nlDir;
  return DOCS_CONTENT_ROOT;
}
