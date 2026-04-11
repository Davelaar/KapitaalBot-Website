import type { Locale } from "@/lib/i18n";
import type { FundMeBlock } from "./types";
import { fundMeArticleNl } from "./nl";
import { fundMeArticleEn } from "./en";
import { fundMeArticleDe } from "./de";
import { fundMeArticleFr } from "./fr";

export type { FundMeBlock } from "./types";
export { KRAKEN_REFERRAL_URL } from "./types";

export const fundMeArticleByLocale: Record<Locale, FundMeBlock[]> = {
  nl: fundMeArticleNl,
  en: fundMeArticleEn,
  de: fundMeArticleDe,
  fr: fundMeArticleFr,
};
