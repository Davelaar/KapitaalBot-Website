import { t, type Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/locale-path";
import { isKennisSlug } from "@/lib/kennis-slugs";

/** Statische pad-segmenten → i18n-key */
const SEGMENT_KEYS: Record<string, string> = {
  dashboard: "nav.data",
  kennis: "breadcrumb.kennis",
  docs: "nav.docs",
  faq: "faq.title",
  over: "nav.about",
  "wat-is-kapitaalbot": "watkap.breadcrumb",
  contact: "contact.title",
  changelog: "changelog.title",
  "tier2-request": "nav.access",
  login: "nav.login",
  admin: "breadcrumb.admin",
  access: "breadcrumb.admin_access",
  cms: "breadcrumb.admin_cms",
  tier2: "nav.tier2",
};

function formatSlugFallback(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function segmentLabel(locale: Locale, segment: string, parent: string | null): string {
  if (parent === "kennis" && isKennisSlug(segment)) {
    const k = `seo.hub.card.${segment}.title`;
    const v = t(locale, k);
    if (v !== k && v.trim().length > 0) return v;
  }
  if (parent === "docs") {
    const k = `docs.meta.${segment}.label`;
    const v = t(locale, k);
    if (v !== k && v.trim().length > 0) return v;
  }
  const key = SEGMENT_KEYS[segment];
  if (key) {
    const v = t(locale, key);
    if (v !== key) return v;
  }
  return formatSlugFallback(segment);
}

export type BreadcrumbItem = { href: string; label: string };

/**
 * Broodkruimels voor het pad zonder locale (bijv. `/dashboard/tier2`).
 * Leeg op home (`/`).
 */
export function buildBreadcrumbItems(locale: Locale, pathnameWithoutLocale: string): BreadcrumbItem[] {
  const normalized = pathnameWithoutLocale === "" ? "/" : pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;
  if (normalized === "/") return [];

  const rawSegs = normalized.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ href: withLocale(locale, "/"), label: t(locale, "nav.home") }];

  let path = "";
  for (let i = 0; i < rawSegs.length; i++) {
    const seg = rawSegs[i];
    path += `/${seg}`;
    const parent = i > 0 ? rawSegs[i - 1]! : null;
    items.push({
      href: withLocale(locale, path),
      label: segmentLabel(locale, seg, parent),
    });
  }
  return items;
}
