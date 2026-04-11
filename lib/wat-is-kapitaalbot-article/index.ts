import type { Locale } from "@/lib/i18n";
import type { WatArticleBlock } from "./types";
import { watIsKapitaalbotArticleNl } from "./nl";
import { watIsKapitaalbotArticleEn } from "./en";
import { watIsKapitaalbotArticleDe } from "./de";
import { watIsKapitaalbotArticleFr } from "./fr";

export type { WatArticleBlock, WatSubBlock } from "./types";

export const watIsKapitaalbotArticleByLocale: Record<Locale, WatArticleBlock[]> = {
  nl: watIsKapitaalbotArticleNl,
  en: watIsKapitaalbotArticleEn,
  de: watIsKapitaalbotArticleDe,
  fr: watIsKapitaalbotArticleFr,
};
