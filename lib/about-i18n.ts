import { aboutNl } from "@/lib/about-copy-nl";
import { aboutEn } from "@/lib/about-copy-en";
import { aboutDe } from "@/lib/about-copy-de";
import { aboutFr } from "@/lib/about-copy-fr";

/** About-page copy: authored per locale in about-copy-*.ts */
export const aboutStrings: Record<"nl" | "en" | "de" | "fr", Record<string, string>> = {
  nl: aboutNl,
  en: aboutEn,
  de: aboutDe,
  fr: aboutFr,
};
