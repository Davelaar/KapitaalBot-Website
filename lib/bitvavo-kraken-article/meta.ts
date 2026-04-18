import type { Locale } from "@/lib/i18n";

/** SEO + OG — per locale (native phrasing). */
export const bitvavoKrakenMeta: Record<
  Locale,
  { title: string; description: string; keywords: string }
> = {
  nl: {
    title: "Bitvavo trading bot of Kraken? Mijn eerlijke vergelijking voor Nederland",
    description:
      "Zoek je op Bitvavo trading bot, Kraken of een legaal crypto platform in Nederland? Dit is mijn actuele vergelijking van Bitvavo, Kraken en andere gereguleerde platforms onder MiCA.",
    keywords:
      "Bitvavo trading bot, Kraken bot, crypto bot Nederland, legaal crypto platform Nederland, MiCA, AFM cryptoregister, Kraken WebSocket, Bitvavo API, execution, EU crypto",
  },
  en: {
    title: "Bitvavo or Kraken for a trading bot? A frank comparison (Netherlands & EU)",
    description:
      "Looking for a Bitvavo bot, a Kraken bot, or a licensed crypto venue in the Netherlands? Here is how Bitvavo, Kraken, and other MiCA-aligned platforms compare for serious execution-focused trading stacks.",
    keywords:
      "Bitvavo vs Kraken, crypto trading bot Netherlands, MiCA crypto service provider, AFM register, Kraken WebSocket API, Bitvavo API, EU crypto regulation, execution quality",
  },
  de: {
    title: "Bitvavo oder Kraken für einen Trading-Bot? Ein ehrlicher Vergleich (Niederlande & EU)",
    description:
      "Du suchst einen Bitvavo-Bot, Kraken-Bot oder eine regulierte Krypto-Börse in den Niederlanden? So unterscheiden sich Bitvavo, Kraken und weitere MiCA-orientierte Plattformen für anspruchsvolle Execution-Setups.",
    keywords:
      "Bitvavo vs Kraken, Krypto Bot Niederlande, MiCA, AFM Register, Kraken WebSocket, Bitvavo API, EU Krypto Regulierung, Execution",
  },
  fr: {
    title: "Bitvavo ou Kraken pour un bot de trading ? Comparaison honnête (Pays-Bas & UE)",
    description:
      "Vous cherchez un bot Bitvavo, un bot Kraken ou une plateforme crypto conforme aux Pays-Bas ? Voici comment je compare Bitvavo, Kraken et d’autres acteurs alignés MiCA pour une stack d’exécution sérieuse.",
    keywords:
      "Bitvavo vs Kraken, bot trading crypto Pays-Bas, MiCA, registre AFM, API Kraken WebSocket, Bitvavo API, régulation crypto UE, qualité d’exécution",
  },
};
