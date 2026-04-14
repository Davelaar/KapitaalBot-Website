/**
 * Enige bron voor FAQ-secties: zelfde structuur als `/faq` en `matchLocalFaq`.
 * Geen losse `faq.seo.*` (bestonden niet in i18n); `legal_data` staat in hoofd-i18n.
 */

export type FaqSectionItem = { qKey: string; aKey: string };

export type FaqSection = {
  id: string;
  titleKey: string;
  items: FaqSectionItem[];
};

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "overview",
    titleKey: "faq.section.overview.title",
    items: [
      { qKey: "faq.overview.q1", aKey: "faq.overview.a1" },
      { qKey: "faq.overview.q2", aKey: "faq.overview.a2" },
      { qKey: "faq.overview.q3", aKey: "faq.overview.a3" },
      { qKey: "faq.overview.q4", aKey: "faq.overview.a4" },
      { qKey: "faq.overview.q5", aKey: "faq.overview.a5" },
      { qKey: "faq.overview.q6", aKey: "faq.overview.a6" },
      { qKey: "faq.overview.q7", aKey: "faq.overview.a7" },
      { qKey: "faq.overview.q8", aKey: "faq.overview.a8" },
      { qKey: "faq.overview.q9", aKey: "faq.overview.a9" },
      { qKey: "faq.overview.q10", aKey: "faq.overview.a10" },
      { qKey: "faq.overview.q11", aKey: "faq.overview.a11" },
      { qKey: "faq.overview.q12", aKey: "faq.overview.a12" },
    ],
  },
  {
    id: "architecture",
    titleKey: "faq.section.architecture.title",
    items: [
      { qKey: "faq.architecture.q1", aKey: "faq.architecture.a1" },
      { qKey: "faq.architecture.q2", aKey: "faq.architecture.a2" },
      { qKey: "faq.architecture.q3", aKey: "faq.architecture.a3" },
      { qKey: "faq.architecture.q4", aKey: "faq.architecture.a4" },
      { qKey: "faq.architecture.q5", aKey: "faq.architecture.a5" },
      { qKey: "faq.architecture.q6", aKey: "faq.architecture.a6" },
      { qKey: "faq.architecture.q7", aKey: "faq.architecture.a7" },
      { qKey: "faq.architecture.q8", aKey: "faq.architecture.a8" },
      { qKey: "faq.architecture.q9", aKey: "faq.architecture.a9" },
      { qKey: "faq.architecture.q10", aKey: "faq.architecture.a10" },
    ],
  },
  {
    id: "regimes_strategies",
    titleKey: "faq.section.regimes_strategies.title",
    items: [
      { qKey: "faq.regimes_strategies.q1", aKey: "faq.regimes_strategies.a1" },
      { qKey: "faq.regimes_strategies.q2", aKey: "faq.regimes_strategies.a2" },
      { qKey: "faq.regimes_strategies.q3", aKey: "faq.regimes_strategies.a3" },
      { qKey: "faq.regimes_strategies.q4", aKey: "faq.regimes_strategies.a4" },
      { qKey: "faq.regimes_strategies.q5", aKey: "faq.regimes_strategies.a5" },
      { qKey: "faq.regimes_strategies.q6", aKey: "faq.regimes_strategies.a6" },
      { qKey: "faq.regimes_strategies.q7", aKey: "faq.regimes_strategies.a7" },
      { qKey: "faq.regimes_strategies.q8", aKey: "faq.regimes_strategies.a8" },
      { qKey: "faq.regimes_strategies.q9", aKey: "faq.regimes_strategies.a9" },
      { qKey: "faq.regimes_strategies.q10", aKey: "faq.regimes_strategies.a10" },
    ],
  },
  {
    id: "risk_safety",
    titleKey: "faq.section.risk_safety.title",
    items: [
      { qKey: "faq.risk_safety.q1", aKey: "faq.risk_safety.a1" },
      { qKey: "faq.risk_safety.q2", aKey: "faq.risk_safety.a2" },
      { qKey: "faq.risk_safety.q3", aKey: "faq.risk_safety.a3" },
      { qKey: "faq.risk_safety.q4", aKey: "faq.risk_safety.a4" },
      { qKey: "faq.risk_safety.q5", aKey: "faq.risk_safety.a5" },
      { qKey: "faq.risk_safety.q6", aKey: "faq.risk_safety.a6" },
      { qKey: "faq.risk_safety.q7", aKey: "faq.risk_safety.a7" },
      { qKey: "faq.risk_safety.q8", aKey: "faq.risk_safety.a8" },
      { qKey: "faq.risk_safety.q9", aKey: "faq.risk_safety.a9" },
      { qKey: "faq.risk_safety.q10", aKey: "faq.risk_safety.a10" },
    ],
  },
  {
    id: "observability",
    titleKey: "faq.section.observability.title",
    items: [
      { qKey: "faq.observability.q1", aKey: "faq.observability.a1" },
      { qKey: "faq.observability.q2", aKey: "faq.observability.a2" },
      { qKey: "faq.observability.q3", aKey: "faq.observability.a3" },
      { qKey: "faq.observability.q4", aKey: "faq.observability.a4" },
      { qKey: "faq.observability.q5", aKey: "faq.observability.a5" },
      { qKey: "faq.observability.q6", aKey: "faq.observability.a6" },
      { qKey: "faq.observability.q7", aKey: "faq.observability.a7" },
      { qKey: "faq.observability.q8", aKey: "faq.observability.a8" },
      { qKey: "faq.observability.q9", aKey: "faq.observability.a9" },
      { qKey: "faq.observability.q10", aKey: "faq.observability.a10" },
    ],
  },
  {
    id: "validation",
    titleKey: "faq.section.validation.title",
    items: [
      { qKey: "faq.validation.q1", aKey: "faq.validation.a1" },
      { qKey: "faq.validation.q2", aKey: "faq.validation.a2" },
      { qKey: "faq.validation.q3", aKey: "faq.validation.a3" },
      { qKey: "faq.validation.q4", aKey: "faq.validation.a4" },
      { qKey: "faq.validation.q5", aKey: "faq.validation.a5" },
      { qKey: "faq.validation.q6", aKey: "faq.validation.a6" },
      { qKey: "faq.validation.q7", aKey: "faq.validation.a7" },
      { qKey: "faq.validation.q8", aKey: "faq.validation.a8" },
      { qKey: "faq.validation.q9", aKey: "faq.validation.a9" },
      { qKey: "faq.validation.q10", aKey: "faq.validation.a10" },
    ],
  },
  {
    id: "legal_data",
    titleKey: "faq.section.legal_data.title",
    items: [
      { qKey: "faq.legal_data.q1", aKey: "faq.legal_data.a1" },
      { qKey: "faq.legal_data.q2", aKey: "faq.legal_data.a2" },
      { qKey: "faq.legal_data.q3", aKey: "faq.legal_data.a3" },
      { qKey: "faq.legal_data.q4", aKey: "faq.legal_data.a4" },
      { qKey: "faq.legal_data.q5", aKey: "faq.legal_data.a5" },
      { qKey: "faq.legal_data.q6", aKey: "faq.legal_data.a6" },
    ],
  },
  {
    id: "funding",
    titleKey: "faq.section.funding.title",
    items: [
      { qKey: "faq.funding.q1", aKey: "faq.funding.a1" },
      { qKey: "faq.funding.q2", aKey: "faq.funding.a2" },
      { qKey: "faq.funding.q3", aKey: "faq.funding.a3" },
      { qKey: "faq.funding.q4", aKey: "faq.funding.a4" },
      { qKey: "faq.funding.q5", aKey: "faq.funding.a5" },
    ],
  },
];

/** Primaire doc-slug voor bronverwijzing in de chat (engine-docs). */
export const FAQ_SECTION_PRIMARY_DOC: Record<string, string> = {
  overview: "DOC_INDEX",
  architecture: "01_ARCHITECTURE",
  regimes_strategies: "03_STRATEGY_PIPELINE",
  risk_safety: "06_RISK_SAFETY",
  observability: "07_OBSERVABILITY",
  validation: "08_OPERATIONS",
  legal_data: "DOC_INDEX",
  funding: "DOC_INDEX",
};
