import type { Locale } from "@/lib/i18n";
import type { WatArticleBlock } from "@/lib/wat-is-kapitaalbot-article/types";
import { bitvavoKrakenArticleNl } from "./nl";
import { bitvavoKrakenArticleEn } from "./en";
import { bitvavoKrakenArticleDe } from "./de";
import { bitvavoKrakenArticleFr } from "./fr";

export type { WatArticleBlock } from "@/lib/wat-is-kapitaalbot-article/types";
export { bitvavoKrakenMeta } from "./meta";

export const bitvavoKrakenArticleByLocale: Record<Locale, WatArticleBlock[]> = {
  nl: bitvavoKrakenArticleNl,
  en: bitvavoKrakenArticleEn,
  de: bitvavoKrakenArticleDe,
  fr: bitvavoKrakenArticleFr,
};
