import type { Locale } from "@/lib/i18n";
import { watIsKapitaalbotNl } from "@/lib/wat-is-kapitaalbot-copy-nl";
import { watIsKapitaalbotEn } from "@/lib/wat-is-kapitaalbot-copy-en";
import { watIsKapitaalbotDe } from "@/lib/wat-is-kapitaalbot-copy-de";
import { watIsKapitaalbotFr } from "@/lib/wat-is-kapitaalbot-copy-fr";

export const watIsKapitaalbotStrings: Record<Locale, Record<string, string>> = {
  nl: watIsKapitaalbotNl,
  en: watIsKapitaalbotEn,
  de: watIsKapitaalbotDe,
  fr: watIsKapitaalbotFr,
};
