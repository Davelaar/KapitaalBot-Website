import { faqFundingNl } from "@/lib/faq-funding-copy-nl";
import { faqFundingEn } from "@/lib/faq-funding-copy-en";
import { faqFundingDe } from "@/lib/faq-funding-copy-de";
import { faqFundingFr } from "@/lib/faq-funding-copy-fr";

export const faqFundingStrings: Record<"nl" | "en" | "de" | "fr", Record<string, string>> = {
  nl: faqFundingNl,
  en: faqFundingEn,
  de: faqFundingDe,
  fr: faqFundingFr,
};
