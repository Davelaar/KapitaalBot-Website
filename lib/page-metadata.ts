import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

const ogLocale: Record<Locale, string> = {
  nl: "nl_NL",
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
};

export function buildPageMetadata(opts: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  /** Optional comma-separated or pre-split keywords for meta keywords */
  keywords?: string | string[];
}): Metadata {
  const base = getSiteUrl();
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${base}${path}`;
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
