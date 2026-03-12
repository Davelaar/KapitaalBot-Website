/**
 * i18n skeleton (sectie 16). NL / EN / DE / FR.
 * Identieke structuur; SEO meta per taal. Uitbreiding: path-based locale of cookie.
 */

export type Locale = "nl" | "en" | "de" | "fr";

export const defaultLocale: Locale = "nl";

export const locales: Locale[] = ["nl", "en", "de", "fr"];

const strings: Record<Locale, Record<string, string>> = {
  nl: {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.status": "Bekijk status",
    "hero.title": "KapitaalBot",
    "hero.subtitle":
      "Multi-regime trading runtime · Multi-strategy execution engine · Autonoom long-running systeem · Risk-guarded · DB-first · Volledig observeerbaar.",
    "cta.tier2": "Vraag toegang (Tier 2)",
    "compliance.default": "Crypto is extreem volatiel. Sterke koersbewegingen kunnen snel tot grote verliezen leiden.",
  },
  en: {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.status": "View status",
    "hero.title": "KapitaalBot",
    "hero.subtitle":
      "Multi-regime trading runtime · Multi-strategy execution engine · Autonomous long-running system · Risk-guarded · DB-first · Fully observable.",
    "cta.tier2": "Request access (Tier 2)",
    "compliance.default": "Crypto is extremely volatile. Strong price movements can quickly lead to substantial losses.",
  },
  de: {
    "nav.home": "Start",
    "nav.dashboard": "Dashboard",
    "nav.status": "Status anzeigen",
    "hero.title": "KapitaalBot",
    "hero.subtitle":
      "Multi-Regime-Trading-Runtime · Multi-Strategie-Execution-Engine · Autonomes Dauerlaufsystem · Risikoabgesichert · DB-first · Vollständig beobachtbar.",
    "cta.tier2": "Zugang anfragen (Tier 2)",
    "compliance.default": "Krypto ist extrem volatil. Starke Kursbewegungen können schnell zu hohen Verlusten führen.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de bord",
    "nav.status": "Voir le statut",
    "hero.title": "KapitaalBot",
    "hero.subtitle":
      "Runtime de trading multi-régime · Moteur d'exécution multi-stratégie · Système autonome de longue durée · Protégé risque · DB-first · Entièrement observable.",
    "cta.tier2": "Demander l'accès (Tier 2)",
    "compliance.default": "Les crypto sont extrêmement volatiles. De fortes variations de cours peuvent rapidement entraîner des pertes importantes.",
  },
};

export function t(locale: Locale, key: string): string {
  return strings[locale]?.[key] ?? strings.nl[key] ?? key;
}
