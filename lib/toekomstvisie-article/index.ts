import type { Locale } from "@/lib/i18n";
import type { WatArticleBlock } from "@/lib/wat-is-kapitaalbot-article/types";
import { toekomstvisieArticleNl } from "./nl";
import { toekomstvisieArticleEn } from "./en";
import { toekomstvisieArticleDe } from "./de";
import { toekomstvisieArticleFr } from "./fr";

export type { WatArticleBlock } from "@/lib/wat-is-kapitaalbot-article/types";
export { toekomstvisieMeta } from "./meta";

export const toekomstvisieArticleByLocale: Record<Locale, WatArticleBlock[]> = {
  nl: toekomstvisieArticleNl,
  en: toekomstvisieArticleEn,
  de: toekomstvisieArticleDe,
  fr: toekomstvisieArticleFr,
};
