import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";
import { withLocale } from "@/lib/locale-path";

const ogLocale: Record<Locale, string> = {
  nl: "nl_NL",
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
};

const hreflangFor: Record<Locale, string> = {
  nl: "nl-NL",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
};

/**
 * @param path Pad zonder taal-segment: `/`, `/faq`, `/kennis/slug`
 */
export function buildPageMetadata(opts: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  keywords?: string | string[];
}): Metadata {
  const base = getSiteUrl().replace(/\/+$/, "");
  const rawPath = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const pathWithoutLocale = rawPath === "" ? "/" : rawPath;

  const canonicalPath = withLocale(opts.locale, pathWithoutLocale);
  const url = `${base}${canonicalPath}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangFor[l]] = `${base}${withLocale(l, pathWithoutLocale)}`;
  }
  languages["x-default"] = `${base}${withLocale(defaultLocale, pathWithoutLocale)}`;

  const keywords =
    opts.keywords === undefined
      ? undefined
      : Array.isArray(opts.keywords)
        ? opts.keywords
        : opts.keywords.split(",").map((s) => s.trim()).filter(Boolean);

  return {
    title: {
      absolute: opts.title,
    },
    description: opts.description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: "website",
      locale: ogLocale[opts.locale] ?? ogLocale.nl,
      siteName: "KapitaalBot",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
