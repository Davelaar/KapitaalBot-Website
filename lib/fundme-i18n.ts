import type { Locale } from "@/lib/i18n";
import { fundMeNl } from "@/lib/fundme-copy-nl";
import { fundMeEn } from "@/lib/fundme-copy-en";
import { fundMeDe } from "@/lib/fundme-copy-de";
import { fundMeFr } from "@/lib/fundme-copy-fr";

export const fundMeStrings: Record<Locale, Record<string, string>> = {
  nl: fundMeNl,
  en: fundMeEn,
  de: fundMeDe,
  fr: fundMeFr,
};
