import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import type { Locale } from "@/lib/i18n";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

const SECTIONS_BY_LOCALE: Record<
  Locale,
  Array<{ title: string; docs: Array<{ path: string; topic: string }> }>
> = {
  nl: [
    {
      title: "Leidende documenten",
      docs: [
        { path: "ENGINE_SSOT.md", topic: "Engine-status, statusmatrix" },
        { path: "ARCHITECTURE_ENGINE_CURRENT.md", topic: "Architectuur" },
        { path: "LIVE_RUNBOOK_CURRENT.md", topic: "Runbook" },
        { path: "VALIDATION_MODEL_CURRENT.md", topic: "Validatiemodel" },
        { path: "OBSERVABILITY_SNAPSHOT_CONTRACT.md", topic: "Observability-contract" },
        { path: "OBSERVABILITY_EXPORT_SETUP.md", topic: "Export-runbook" },
        { path: "CHANGELOG_ENGINE.md", topic: "Changelog van de engine" },
        { path: "LOGGING.md", topic: "Logging" },
        { path: "INGEST_EXECUTION_EPOCH_CONTRACT.md", topic: "Epoch/snapshot-contract" },
      ],
    },
    {
      title: "Ondersteunend / referentie",
      docs: [
        { path: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md", topic: "State-first, partitie, generatie" },
        { path: "EXECUTION_REPORT_FRESHNESS_AND_500L3.md", topic: "Versheid, veiligheid, L3" },
        { path: "VALIDATION_REPORT_REFRESH_15MIN_RESET.md", topic: "15-min validatie, DB-reset" },
      ],
    },
  ],
  en: [
    {
      title: "Lead documents",
      docs: [
        { path: "ENGINE_SSOT.md", topic: "Engine status, status matrix" },
        { path: "ARCHITECTURE_ENGINE_CURRENT.md", topic: "Architecture" },
        { path: "LIVE_RUNBOOK_CURRENT.md", topic: "Runbook" },
        { path: "VALIDATION_MODEL_CURRENT.md", topic: "Validation model" },
        { path: "OBSERVABILITY_SNAPSHOT_CONTRACT.md", topic: "Observability contract" },
        { path: "OBSERVABILITY_EXPORT_SETUP.md", topic: "Export runbook" },
        { path: "CHANGELOG_ENGINE.md", topic: "Engine changelog" },
        { path: "LOGGING.md", topic: "Logging" },
        { path: "INGEST_EXECUTION_EPOCH_CONTRACT.md", topic: "Epoch/snapshot contract" },
      ],
    },
    {
      title: "Supporting / reference",
      docs: [
        { path: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md", topic: "State-first, partition, generation" },
        { path: "EXECUTION_REPORT_FRESHNESS_AND_500L3.md", topic: "Freshness, safety, L3" },
        { path: "VALIDATION_REPORT_REFRESH_15MIN_RESET.md", topic: "15-min validation, DB reset" },
      ],
    },
  ],
  de: [
    {
      title: "Leitdokumente",
      docs: [
        { path: "ENGINE_SSOT.md", topic: "Engine-Status, Statusmatrix" },
        { path: "ARCHITECTURE_ENGINE_CURRENT.md", topic: "Architektur" },
        { path: "LIVE_RUNBOOK_CURRENT.md", topic: "Runbook" },
        { path: "VALIDATION_MODEL_CURRENT.md", topic: "Validierungsmodell" },
        { path: "OBSERVABILITY_SNAPSHOT_CONTRACT.md", topic: "Observability-Vertrag" },
        { path: "OBSERVABILITY_EXPORT_SETUP.md", topic: "Export-Runbook" },
        { path: "CHANGELOG_ENGINE.md", topic: "Engine-Changelog" },
        { path: "LOGGING.md", topic: "Logging" },
        { path: "INGEST_EXECUTION_EPOCH_CONTRACT.md", topic: "Epoch/Snapshot-Vertrag" },
      ],
    },
    {
      title: "Unterstützend / Referenz",
      docs: [
        { path: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md", topic: "State-first, Partition, Generierung" },
        { path: "EXECUTION_REPORT_FRESHNESS_AND_500L3.md", topic: "Frischegrad, Sicherheit, L3" },
        { path: "VALIDATION_REPORT_REFRESH_15MIN_RESET.md", topic: "15-min Validierung, DB-Reset" },
      ],
    },
  ],
  fr: [
    {
      title: "Documents principaux",
      docs: [
        { path: "ENGINE_SSOT.md", topic: "Statut moteur, matrice des statuts" },
        { path: "ARCHITECTURE_ENGINE_CURRENT.md", topic: "Architecture" },
        { path: "LIVE_RUNBOOK_CURRENT.md", topic: "Runbook" },
        { path: "VALIDATION_MODEL_CURRENT.md", topic: "Modèle de validation" },
        { path: "OBSERVABILITY_SNAPSHOT_CONTRACT.md", topic: "Contrat d'observabilité" },
        { path: "OBSERVABILITY_EXPORT_SETUP.md", topic: "Runbook d'export" },
        { path: "CHANGELOG_ENGINE.md", topic: "Changelog du moteur" },
        { path: "LOGGING.md", topic: "Journalisation" },
        { path: "INGEST_EXECUTION_EPOCH_CONTRACT.md", topic: "Contrat epoch/snapshot" },
      ],
    },
    {
      title: "Complémentaire / référence",
      docs: [
        { path: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md", topic: "State-first, partition, génération" },
        { path: "EXECUTION_REPORT_FRESHNESS_AND_500L3.md", topic: "Fraîcheur, sécurité, L3" },
        { path: "VALIDATION_REPORT_REFRESH_15MIN_RESET.md", topic: "Validation 15 min, reset DB" },
      ],
    },
  ],
};

export default async function Tier2DocsPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" locale={locale} />;
  }
  const sections = SECTIONS_BY_LOCALE[locale];
  const ui = {
    nl: { navBack: "Dashboard Tier 2", title: "Documentatie (Tier 2)", intro: "Volledige documentindex. Bron: KRAKENBOTMAART docs/DOC_INDEX.md." },
    en: { navBack: "Dashboard Tier 2", title: "Documentation (Tier 2)", intro: "Full document index. Source: KRAKENBOTMAART docs/DOC_INDEX.md." },
    de: { navBack: "Dashboard Tier 2", title: "Dokumentation (Tier 2)", intro: "Vollständiger Dokumentindex. Quelle: KRAKENBOTMAART docs/DOC_INDEX.md." },
    fr: { navBack: "Dashboard Tier 2", title: "Documentation (Tier 2)", intro: "Index complet des documents. Source : KRAKENBOTMAART docs/DOC_INDEX.md." },
  }[locale];

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/dashboard/tier2")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {ui.navBack}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{ui.title}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{ui.intro}</p>
      {sections.map((sec) => (
        <section key={sec.title} className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{sec.title}</h2>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", fontSize: "0.9rem" }}>
            {sec.docs.map((d) => (
              <li key={d.path}>
                <code>{d.path}</code> — {d.topic}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
