import type { KennisSlug } from "@/lib/kennis-slugs";
import { seoNl } from "@/lib/seo-copy-nl";
import { seoEn } from "@/lib/seo-copy-en";
import { seoDe } from "@/lib/seo-copy-de";
import { seoFr } from "@/lib/seo-copy-fr";

/**
 * SEO copy index. NL / EN / DE / FR are authored independently per locale in `seo-copy-*.ts`
 * (native tone for each audience — not machine translation from a single source).
 */
export const seoStrings: Record<"nl" | "en" | "de" | "fr", Record<string, string>> = {
  nl: seoNl,
  en: seoEn,
  de: seoDe,
  fr: seoFr,
};

export function seoPageKeys(slug: KennisSlug): {
  metaTitle: string;
  metaDesc: string;
  h1: string;
  lead: string;
  p: string[];
} {
  const base = `seo.page.${slug}`;
  return {
    metaTitle: `${base}.metaTitle`,
    metaDesc: `${base}.metaDesc`,
    h1: `${base}.h1`,
    lead: `${base}.lead`,
    p: [`${base}.p1`, `${base}.p2`, `${base}.p3`, `${base}.p4`],
  };
}
