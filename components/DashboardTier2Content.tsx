"use client";

import Link from "next/link";
import { MermaidLiveDiagram } from "@/components/MermaidLiveDiagram";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import type {
  EpochIngestPoint,
  EventBufferKpis,
  LabelCount,
  MissedMoveBucket,
  RunHealthPoint,
  Tier2DataBundle,
  Tier2EdgeboardSignalRow,
  Tier2ExecutionSnapshot,
  Tier2LatencySnapshot,
  Tier2PnlSnapshot,
  Tier2SafetySnapshot,
} from "@/lib/snapshots";

interface DashboardTier2ContentProps {
  dataBundle: Tier2DataBundle | null;
  execution: Tier2ExecutionSnapshot | null;
  latency: Tier2LatencySnapshot | null;
  pnl: Tier2PnlSnapshot | null;
  safety: Tier2SafetySnapshot | null;
}

function formatRunHealthPoint(p: RunHealthPoint | null | undefined, ui: any): string {
  if (!p) return ui.noRunHealthSample;
  const freshness = p.feed_freshness_secs != null ? `${Math.round(p.feed_freshness_secs)} s` : "n.v.t.";
  const freshnessLabel = freshness === "n.v.t." ? ui.na : freshness;
  const base = `${ui.runWord} ${p.run_id} · ${ui.modeLabel}=${p.mode ?? ui.unknownMode} · ${ui.feedFreshnessLabel} ~${freshnessLabel}`;
  if (p.ticker_rows != null || p.trade_rows != null || p.l2_rows != null || p.l3_rows != null) {
    return `${base} · ${ui.runRowsLabel}: ${p.ticker_rows ?? "—"}/${p.trade_rows ?? "—"}/${p.l2_rows ?? "—"}/${p.l3_rows ?? "—"}`;
  }
  return base;
}

function formatEpochIngestPoint(p: EpochIngestPoint, ui: any): string {
  const bit = (v: boolean) => (v ? ui.yes : ui.no);
  return `${ui.epochWord} ${p.epoch_id} · status=${p.status} · symbols=${p.symbol_count} · ${ui.epochCriteriaLabel}: ${bit(p.criteria_ticker_ok)}/${bit(p.criteria_trade_ok)}/${bit(p.criteria_l2_ok)}/${bit(p.criteria_l3_ok)} · ${ui.completedAtLabel}: ${p.completed_at ?? ui.na}`;
}

function summarizeLabelCounts(rows: LabelCount[] | null | undefined, ui: any): string {
  if (!rows || rows.length === 0) return ui.noData;
  return rows
    .map((r) => `${r.label}: ${r.count}`)
    .join(" · ");
}

function summarizeMissedMoves(rows: MissedMoveBucket[] | null | undefined, ui: any): string {
  if (!rows || rows.length === 0) return ui.noMeasurements;
  const total = rows.reduce((acc, r) => acc + r.count, 0);
  const worst = rows[rows.length - 1];
  return `n=${total}, ${ui.worstBucketPrefix} ~${worst.bucket_bps} bps (count=${worst.count})`;
}

function summarizeEventBuffer(kpis: EventBufferKpis | null | undefined, ui: any): string {
  if (!kpis) return ui.noEventBufferStats;
  const statusExtra =
    kpis.status_counts_24h && kpis.status_counts_24h.length > 0
      ? ` · status: ${summarizeLabelCounts(kpis.status_counts_24h, ui)}`
      : "";
  return `buffered_active=${kpis.buffered_active_count}, buffered_total=${kpis.buffered_total_count}, released_24h=${kpis.released_24h_count}, timeout_24h=${kpis.timeout_24h_count}, unknown_24h=${kpis.unknown_24h_count}${statusExtra}`;
}

function summarizeEdgeboardSignals(
  rows: Tier2EdgeboardSignalRow[] | null | undefined,
  ui: any,
): string {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return ui.noData;
  return rows
    .slice(0, 5)
    .map((r) => {
      const boost = typeof r.boost === "number" ? r.boost.toFixed(3) : "—";
      const edge = typeof r.expected_net_edge_bps === "number" ? r.expected_net_edge_bps.toFixed(1) : "—";
      const conf = typeof r.confidence === "number" ? r.confidence.toFixed(2) : "—";
      return `${r.symbol} (#${r.rank}, ${r.route_name}, edge ${edge} bps, conf ${conf}, boost ${boost})`;
    })
    .join(" · ");
}

function disclosureText(bundle: Tier2DataBundle, locale: string): string {
  if (locale === "nl") return bundle.disclosure_policy.explanation_nl;
  return `Aggregates use ~${bundle.disclosure_policy.bucket_minutes} minute buckets and are intentionally delayed vs live trading (copy-trading protection).`;
}

export function DashboardTier2Content({
  dataBundle,
  execution,
  latency,
  pnl,
  safety,
}: DashboardTier2ContentProps) {
  const locale = useLocale();
  const ui = {
    nl: {
      navBack: "Dashboard",
      title: "Dashboard Tier 2",
      intro:
        "Uitgebreide observability uit <code>tier2_*</code> snapshots. Echte data; geen placeholders.",
      noDataTitle: "Geen Tier 2-data",
      noDataText:
        "Er zijn nog geen snapshot-bestanden (<code>tier2_*</code> en/of <code>tier2_data_bundle.json</code>). Voer op de bot <code>export-observability-snapshots</code> uit en zorg dat <code>OBSERVABILITY_EXPORT_DIR</code> voor deze site naar dezelfde map wijst.",
      linkToTier1: "Ga naar Data (Tier 1)",
      sectionA: "A. Run & Data Health",
      sectionB: "B. Epoch & Ingest",
      sectionC: "C. Execution (orders/fills)",
      sectionD: "D. Latency-profiel",
      sectionE: "E. PnL & Positions",
      sectionF: "F. Safety & WS",
      sectionG: "G. Market / pair summary",
      sectionH: "H. Shadow trades",
      sectionI: "I. Event buffer KPI",
      sectionJ: "J. Data-bundle (ingest + decision)",
      dataBundleFile: "Bronbestand:",
      dataBundleRoles: "DB-rollen:",
      disclosureHeading: "Disclosure",
      subIntake: "Intake / universe",
      subRoute: "Route / no-trade",
      subRisk: "Risk & capital",
      subEntry: "Entry & execution funnel",
      subPath: "Path doctrine",
      subInfra: "Infra",
      subEdgeboard: "Edgeboard",
      edgeboardUnavailable: "Geen zichtbare edgeboard-snapshot in RESEARCH.",
      edgeboardTopSignals: "Top signals:",
      edgeboardHealth: "Snapshot / health:",
      capitalEvents24h: "Capital-stage events 24h:",
      correlationOrders24h: "Orders met correlation 24h:",
      funnelPathTapeRows24h: "Funnel-rijen met path_tape 24h:",
      noRunHealthSample: "Geen recente run-health sample.",
      unknownMode: "onbekend",
      runWord: "Run",
      modeLabel: "mode",
      feedFreshnessLabel: "feed freshness",
      epochWord: "Epoch",
      validLabel: "geldig=",
      na: "n.v.t.",
      noData: "geen data",
      noMeasurements: "geen metingen",
      worstBucketPrefix: "zwaarste bucket",
      noEventBufferStats: "geen event-buffer statistieken (n.v.t. of tabel leeg).",
      exportLabel: "Export",
      symbolsTraded24hLabel: "symbols verhandeld 24h",
      epochSymbolsOkExpectedLabel: "symbols (ok/verwacht):",
      epochSummaryMissing: "Geen epoch/ingest-samenvatting in snapshot.",
      runRowsLabel: "rijen t/tr/L2/L3",
      epochCriteriaLabel: "criteria (tick/trade/L2/L3)",
      completedAtLabel: "voltooid",
      netEntryNotionalLabel: "net entry notional (quote)",
      sharpeLabel: "Sharpe-achtig 24h",
      sortinoLabel: "Sortino-achtig 24h",
      activeQuietsLabel: "actieve quiets",
      activeHardBlocksLabel: "actieve hard-blocks",
      yes: "ja",
      no: "nee",
      orders24hLabel: "Orders 24h:",
      fills24hLabel: "Fills 24h:",
      orderStatus24hLabel: "Orderstatus 24h:",
      fillsPerSide24hLabel: "Fills per side 24h:",
      latencyAvgPrefix: "submit→ack gemiddeld ~",
      latencyNoSamplesPrefix: "Geen submit→ack samples",
      histogramLabel: "Histogram (submit→ack):",
      bucketsLabel: "buckets",
      noHistogramAvailable: "geen histogram beschikbaar",
      realizedPnlLabel: "Gerealiseerd PnL (24h, quote):",
      maxDrawdownLabel: "Max drawdown (op basis van equity-trend, vertraagd):",
      openPositionsLabel: "Open posities:",
      exitOnlyCountLabel: "exit-only:",
      hardBlockedCountLabel: "hard-blocked:",
      netExposureLabel: "net exposure (base):",
      normalCountLabel: "Normal:",
      exitOnlyLabel: "Exit-only:",
      hardBlockedLabel: "Hard-blocked:",
      symbolsPerSafetyModeLabel: "Symbolen per safety-mode:",
      noPerSymbolSafetyModes: "geen per-symbol safety-modes in snapshot.",
      withPerSymbolSafetyModes: (n: number) => `${n} symbolen met expliciete modus`,
      marketSummaryLinkText: "Data-pagina",
      marketSummaryText:
        "Markt- en pairsamenvatting (spreads, suitability, L3-kwaliteit) blijft op het Tier 1 dashboard staan. Gebruik daarvoor de",
      marketSummaryText2: "met de MarketSummary-module.",
      shadowOutcomeDistributionLabel: "Outcome-distributie:",
      shadowMissedMoveHistogramLabel: "Missed-move histogram:",
      sectionConceptual: "Tier-model & dataflow (conceptueel)",
    },
    en: {
      navBack: "Dashboard",
      title: "Tier 2 Dashboard",
      intro:
        "Extended observability from <code>tier2_*</code> snapshots. Real data; no placeholders.",
      noDataTitle: "No Tier 2 data",
      noDataText:
        "No snapshot files yet (<code>tier2_*</code> and/or <code>tier2_data_bundle.json</code>). Run <code>export-observability-snapshots</code> on the bot and point <code>OBSERVABILITY_EXPORT_DIR</code> for this site at the same directory.",
      linkToTier1: "Go to Data (Tier 1)",
      sectionA: "A. Run & Data Health",
      sectionB: "B. Epoch & Ingest",
      sectionC: "C. Execution (orders/fills)",
      sectionD: "D. Latency profile",
      sectionE: "E. PnL & Positions",
      sectionF: "F. Safety & WS",
      sectionG: "G. Market / pair summary",
      sectionH: "H. Shadow trades",
      sectionI: "I. Event buffer KPI",
      sectionJ: "J. Data bundle (ingest + decision)",
      dataBundleFile: "Source file:",
      dataBundleRoles: "DB roles:",
      disclosureHeading: "Disclosure",
      subIntake: "Intake / universe",
      subRoute: "Route / no-trade",
      subRisk: "Risk & capital",
      subEntry: "Entry & execution funnel",
      subPath: "Path doctrine",
      subInfra: "Infra",
      subEdgeboard: "Edgeboard",
      edgeboardUnavailable: "No visible edgeboard snapshot in RESEARCH.",
      edgeboardTopSignals: "Top signals:",
      edgeboardHealth: "Snapshot / health:",
      capitalEvents24h: "Capital-stage funnel events 24h:",
      correlationOrders24h: "Orders with correlation 24h:",
      funnelPathTapeRows24h: "Funnel rows with path_tape 24h:",
      noRunHealthSample: "No recent run-health sample.",
      unknownMode: "unknown",
      runWord: "Run",
      modeLabel: "mode",
      feedFreshnessLabel: "feed freshness",
      epochWord: "Epoch",
      validLabel: "valid=",
      na: "n/a",
      noData: "no data",
      noMeasurements: "no measurements",
      worstBucketPrefix: "worst bucket",
      noEventBufferStats: "no event-buffer statistics (n/a or empty table).",
      exportLabel: "Export",
      symbolsTraded24hLabel: "symbols traded 24h",
      epochSymbolsOkExpectedLabel: "symbols (ok/expected):",
      epochSummaryMissing: "No epoch/ingest summary in snapshot.",
      runRowsLabel: "rows t/tr/L2/L3",
      epochCriteriaLabel: "criteria (tick/trade/L2/L3)",
      completedAtLabel: "completed",
      netEntryNotionalLabel: "net entry notional (quote)",
      sharpeLabel: "Sharpe-like 24h",
      sortinoLabel: "Sortino-like 24h",
      activeQuietsLabel: "active quiets",
      activeHardBlocksLabel: "active hard-blocks",
      yes: "yes",
      no: "no",
      orders24hLabel: "Orders 24h:",
      fills24hLabel: "Fills 24h:",
      orderStatus24hLabel: "Order status 24h:",
      fillsPerSide24hLabel: "Fills per side 24h:",
      latencyAvgPrefix: "submit→ack average ~",
      latencyNoSamplesPrefix: "No submit→ack samples",
      histogramLabel: "Histogram (submit→ack):",
      bucketsLabel: "bins",
      noHistogramAvailable: "no histogram available",
      realizedPnlLabel: "Realized PnL (24h, quote):",
      maxDrawdownLabel: "Max drawdown (based on equity trend, delayed):",
      openPositionsLabel: "Open positions:",
      exitOnlyCountLabel: "exit-only:",
      hardBlockedCountLabel: "hard-blocked:",
      netExposureLabel: "net exposure (base):",
      normalCountLabel: "Normal:",
      exitOnlyLabel: "Exit-only:",
      hardBlockedLabel: "Hard-blocked:",
      symbolsPerSafetyModeLabel: "Symbols per safety mode:",
      noPerSymbolSafetyModes: "no per-symbol safety modes in snapshot.",
      withPerSymbolSafetyModes: (n: number) => `${n} symbols with explicit mode`,
      marketSummaryLinkText: "Data page",
      marketSummaryText:
        "Market and pair summary (spreads, suitability, L3 quality) stays on the Tier 1 dashboard. Use the",
      marketSummaryText2: "with the MarketSummary module.",
      shadowOutcomeDistributionLabel: "Outcome distribution:",
      shadowMissedMoveHistogramLabel: "Missed-move histogram:",
      sectionConceptual: "Tier model & dataflow (conceptual)",
    },
    de: {
      navBack: "Dashboard",
      title: "Tier 2 Dashboard",
      intro:
        "Erweiterte Observability aus <code>tier2_*</code>-Snapshots. Echte Daten; keine Platzhalter.",
      noDataTitle: "Keine Tier-2-Daten",
      noDataText:
        "Es gibt noch keine <code>tier2_*</code>-Snapshot-Dateien. Führe <code>export-observability-snapshots</code> am Bot aus; danach erscheinen hier die Module.",
      linkToTier1: "Zu Data (Tier 1) gehen",
      sectionA: "A. Run & Data Health",
      sectionB: "B. Epoch & Ingest",
      sectionC: "C. Execution (orders/fills)",
      sectionD: "D. Latenzprofil",
      sectionE: "E. PnL & Positionen",
      sectionF: "F. Safety & WS",
      sectionG: "G. Markt / Pair-Übersicht",
      sectionH: "H. Shadow-Trades",
      sectionI: "I. Event-Buffer KPI",
      sectionJ: "J. Daten-Bundle (Ingest + Decision)",
      dataBundleFile: "Quelldatei:",
      dataBundleRoles: "DB-Rollen:",
      disclosureHeading: "Hinweis",
      subIntake: "Intake / Universe",
      subRoute: "Route / No-Trade",
      subRisk: "Risk & Kapital",
      subEntry: "Entry & Execution-Funnel",
      subPath: "Path-Doktrin",
      subInfra: "Infra",
      subEdgeboard: "Edgeboard",
      edgeboardUnavailable: "Kein sichtbarer Edgeboard-Snapshot in RESEARCH.",
      edgeboardTopSignals: "Top-Signale:",
      edgeboardHealth: "Snapshot / Health:",
      capitalEvents24h: "Capital-Stage-Events 24h:",
      correlationOrders24h: "Orders mit Correlation 24h:",
      funnelPathTapeRows24h: "Funnel-Zeilen mit path_tape 24h:",
      noRunHealthSample: "Kein aktuelles Run-Health-Beispiel.",
      unknownMode: "unbekannt",
      runWord: "Run",
      modeLabel: "mode",
      feedFreshnessLabel: "Feed-Freshness",
      epochWord: "Epoch",
      validLabel: "gültig=",
      na: "n.v.t.",
      noData: "keine Daten",
      noMeasurements: "keine Messungen",
      worstBucketPrefix: "schlimmste Bucket",
      noEventBufferStats: "keine Event-Buffer-Statistiken (n.v.t. oder leere Tabelle).",
      exportLabel: "Export",
      symbolsTraded24hLabel: "Symbole gehandelt 24h",
      epochSymbolsOkExpectedLabel: "Symbole (ok/erwartet):",
      epochSummaryMissing: "Keine Epoch-/Ingest-Zusammenfassung im Snapshot.",
      runRowsLabel: "Zeilen t/tr/L2/L3",
      epochCriteriaLabel: "Kriterien (Tick/Trade/L2/L3)",
      completedAtLabel: "abgeschlossen",
      netEntryNotionalLabel: "Net-Entry-Notional (Quote)",
      sharpeLabel: "Sharpe-ähnlich 24h",
      sortinoLabel: "Sortino-ähnlich 24h",
      activeQuietsLabel: "aktive Quiets",
      activeHardBlocksLabel: "aktive Hard-Blocks",
      yes: "ja",
      no: "nein",
      orders24hLabel: "Orders 24h:",
      fills24hLabel: "Fills 24h:",
      orderStatus24hLabel: "Orderstatus 24h:",
      fillsPerSide24hLabel: "Fills je Seite 24h:",
      latencyAvgPrefix: "submit→ack Durchschnitt ~",
      latencyNoSamplesPrefix: "Keine submit→ack Samples",
      histogramLabel: "Histogramm (submit→ack):",
      bucketsLabel: "Bins",
      noHistogramAvailable: "kein Histogramm verfügbar",
      realizedPnlLabel: "Realisierter PnL (24h, quote):",
      maxDrawdownLabel: "Max. Drawdown (basierend auf Equity-Trend, verzögert):",
      openPositionsLabel: "Offene Positionen:",
      exitOnlyCountLabel: "exit-only:",
      hardBlockedCountLabel: "hard-blocked:",
      netExposureLabel: "Net Exposure (base):",
      normalCountLabel: "Normal:",
      exitOnlyLabel: "Exit-only:",
      hardBlockedLabel: "Hard-blocked:",
      symbolsPerSafetyModeLabel: "Symbole pro Safety-Mode:",
      noPerSymbolSafetyModes: "keine per-Symbol Safety-Modes im Snapshot.",
      withPerSymbolSafetyModes: (n: number) => `${n} Symbole mit explizitem Modus`,
      marketSummaryLinkText: "Data-Seite",
      marketSummaryText:
        "Markt- und Pair-Zusammenfassung (Spreads, Suitability, L3-Qualität) bleibt auf dem Tier-1-Dashboard. Verwende die",
      marketSummaryText2: "mit dem MarketSummary-Modul.",
      shadowOutcomeDistributionLabel: "Outcome-Verteilung:",
      shadowMissedMoveHistogramLabel: "Missed-Move-Histogramm:",
      sectionConceptual: "Tier-Modell & Datenfluss (konzeptionell)",
    },
    fr: {
      navBack: "Dashboard",
      title: "Dashboard Tier 2",
      intro:
        "Observabilité étendue via les snapshots <code>tier2_*</code>. Données réelles ; pas de placeholders.",
      noDataTitle: "Aucune donnée Tier 2",
      noDataText:
        "Il n’y a encore aucun fichier de snapshot <code>tier2_*</code>. Lance <code>export-observability-snapshots</code> sur le bot ; les modules apparaîtront ensuite ici.",
      linkToTier1: "Aller aux données (Tier 1)",
      sectionA: "A. Run & Data Health",
      sectionB: "B. Epoch & Ingest",
      sectionC: "C. Execution (orders/fills)",
      sectionD: "D. Profil de latence",
      sectionE: "E. PnL & Positions",
      sectionF: "F. Safety & WS",
      sectionG: "G. Résumé marché / paire",
      sectionH: "H. Shadow trades",
      sectionI: "I. KPI du buffer d'événements",
      sectionJ: "J. Bundle Data (ingest + decision)",
      dataBundleFile: "Fichier source :",
      dataBundleRoles: "Rôles DB :",
      disclosureHeading: "Divulgation",
      subIntake: "Intake / univers",
      subRoute: "Route / no-trade",
      subRisk: "Risque & capital",
      subEntry: "Entrée & funnel execution",
      subPath: "Doctrine path",
      subInfra: "Infra",
      subEdgeboard: "Edgeboard",
      edgeboardUnavailable: "Aucun snapshot Edgeboard visible dans RESEARCH.",
      edgeboardTopSignals: "Top signaux :",
      edgeboardHealth: "Snapshot / santé :",
      capitalEvents24h: "Événements funnel capital 24h :",
      correlationOrders24h: "Ordres avec correlation 24h :",
      funnelPathTapeRows24h: "Lignes funnel avec path_tape 24h :",
      noRunHealthSample: "Aucun échantillon récent de run-health.",
      unknownMode: "inconnu",
      runWord: "Run",
      modeLabel: "mode",
      feedFreshnessLabel: "fraîcheur du feed",
      epochWord: "Epoch",
      validLabel: "valide=",
      na: "n/a",
      noData: "aucune donnée",
      noMeasurements: "aucune mesure",
      worstBucketPrefix: "pire bucket",
      noEventBufferStats: "aucune statistique de buffer d'événements (n/a ou table vide).",
      exportLabel: "Export",
      symbolsTraded24hLabel: "symboles échangés 24h",
      epochSymbolsOkExpectedLabel: "symboles (ok/attendu) :",
      epochSummaryMissing: "Aucun résumé epoch/ingest dans le snapshot.",
      runRowsLabel: "lignes t/tr/L2/L3",
      epochCriteriaLabel: "critères (tick/trade/L2/L3)",
      completedAtLabel: "terminé",
      netEntryNotionalLabel: "notional d'entrée net (quote)",
      sharpeLabel: "Sharpe-like 24h",
      sortinoLabel: "Sortino-like 24h",
      activeQuietsLabel: "quiets actifs",
      activeHardBlocksLabel: "hard-blocks actifs",
      yes: "oui",
      no: "non",
      orders24hLabel: "Orders 24h :",
      fills24hLabel: "Fills 24h :",
      orderStatus24hLabel: "Statut orders 24h :",
      fillsPerSide24hLabel: "Fills par côté 24h :",
      latencyAvgPrefix: "submit→ack moyenne ~",
      latencyNoSamplesPrefix: "Aucun échantillon submit→ack",
      histogramLabel: "Histogramme (submit→ack) :",
      bucketsLabel: "bins",
      noHistogramAvailable: "aucun histogramme disponible",
      realizedPnlLabel: "PnL réalisé (24h, quote) :",
      maxDrawdownLabel: "Drawdown max (basé sur la tendance equity, retardé) :",
      openPositionsLabel: "Positions ouvertes :",
      exitOnlyCountLabel: "exit-only :",
      hardBlockedCountLabel: "hard-blocked :",
      netExposureLabel: "exposition nette (base) :",
      normalCountLabel: "Normal :",
      exitOnlyLabel: "Exit-only :",
      hardBlockedLabel: "Hard-blocked :",
      symbolsPerSafetyModeLabel: "Symboles par mode de safety :",
      noPerSymbolSafetyModes: "aucun safety mode par symbole dans le snapshot.",
      withPerSymbolSafetyModes: (n: number) => `${n} symboles avec mode explicite`,
      marketSummaryLinkText: "Page Data",
      marketSummaryText:
        "Le résumé marché et paires (spreads, suitability, qualité L3) reste sur le dashboard Tier 1. Utilise la",
      marketSummaryText2: "avec le module MarketSummary.",
      shadowOutcomeDistributionLabel: "Distribution des outcomes :",
      shadowMissedMoveHistogramLabel: "Histogramme missed-move :",
      sectionConceptual: "Modèle de tiers & flux de données (conceptuel)",
    },
  }[locale];

  const hasAny =
    dataBundle !== null ||
    execution !== null ||
    latency !== null ||
    pnl !== null ||
    safety !== null;

  return (
    <>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {ui.navBack}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        {ui.title}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        <span dangerouslySetInnerHTML={{ __html: ui.intro }} />
      </p>

      {dataBundle && (
        <section
          className="card"
          style={{
            marginBottom: "1rem",
            padding: "1rem 1.25rem",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>{ui.sectionJ}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.5rem" }}>
            {ui.dataBundleFile} <code>tier2_data_bundle.json</code> · contract {dataBundle.contract_version} ·{" "}
            {dataBundle.exported_at}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.5rem" }}>
            {ui.dataBundleRoles}{" "}
            <strong style={{ color: "var(--fg)" }}>
              {dataBundle.source_db.intake_role}
            </strong>{" "}
            /{" "}
            <strong style={{ color: "var(--fg)" }}>{dataBundle.source_db.decision_role}</strong>
            {dataBundle.source_db.research_role ? (
              <>
                {" "}
                / <strong style={{ color: "var(--fg)" }}>{dataBundle.source_db.research_role}</strong>
              </>
            ) : null}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.75rem" }}>
            <strong style={{ color: "var(--fg)" }}>{ui.disclosureHeading}</strong> (
            {dataBundle.disclosure_policy.kind}, {dataBundle.disclosure_policy.bucket_minutes} min):{" "}
            {disclosureText(dataBundle, locale)}
          </p>

          {dataBundle.intake_universe && (
            <div style={{ marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subIntake}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                epoch {dataBundle.intake_universe.epoch_id ?? "—"} · status{" "}
                {dataBundle.intake_universe.epoch_status ?? "—"} · symbols{" "}
                {dataBundle.intake_universe.epoch_symbol_count ?? "—"}
                {dataBundle.intake_universe.run_id != null
                  ? ` · run ${dataBundle.intake_universe.run_id} (rows ${dataBundle.intake_universe.run_symbol_rows ?? "—"}, ticker ${dataBundle.intake_universe.run_ticker_sum ?? "—"}, trade ${dataBundle.intake_universe.run_trade_sum ?? "—"}, L2 ${dataBundle.intake_universe.run_l2_sum ?? "—"}, L3 ${dataBundle.intake_universe.run_l3_sum ?? "—"})`
                  : ""}
              </p>
            </div>
          )}

          {dataBundle.route_no_trade && (
            <div style={{ marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subRoute}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                stage: {summarizeLabelCounts(dataBundle.route_no_trade.funnel_stage_counts_24h, ui)}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                decision_code: {summarizeLabelCounts(dataBundle.route_no_trade.funnel_decision_code_counts_24h, ui)}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                path_tape (events): {summarizeLabelCounts(dataBundle.route_no_trade.path_tape_event_counts_24h, ui)}
              </p>
              {dataBundle.route_no_trade.shadow_blocker_counts &&
                dataBundle.route_no_trade.shadow_blocker_counts.length > 0 && (
                  <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                    shadow blockers: {summarizeLabelCounts(dataBundle.route_no_trade.shadow_blocker_counts, ui)}
                  </p>
                )}
            </div>
          )}

          {dataBundle.risk_capital && (
            <div style={{ marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subRisk}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                safety by mode: {summarizeLabelCounts(dataBundle.risk_capital.symbol_safety_by_mode, ui)}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                {ui.capitalEvents24h} {dataBundle.risk_capital.funnel_capital_events_24h}
              </p>
            </div>
          )}

          {dataBundle.entry_execution && (
            <div style={{ marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subEntry}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                execution stage events 24h: {dataBundle.entry_execution.execution_stage_events_24h} · fill stage:{" "}
                {dataBundle.entry_execution.fill_stage_events_24h} · {ui.correlationOrders24h}{" "}
                {dataBundle.entry_execution.orders_with_correlation_24h}
              </p>
            </div>
          )}

          {dataBundle.path_doctrine && (
            <div style={{ marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subPath}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                orders by path_tape: {summarizeLabelCounts(dataBundle.path_doctrine.orders_by_path_tape_24h, ui)}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                {ui.funnelPathTapeRows24h} {dataBundle.path_doctrine.funnel_rows_with_path_tape_24h}
              </p>
            </div>
          )}

          {dataBundle.infra && (
            <div>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subInfra}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                recovery requests 24h: {dataBundle.infra.recovery_requests_24h} · watchdog:{" "}
                {dataBundle.infra.latest_watchdog_state ?? "—"} · event-buffer unknown:{" "}
                {dataBundle.infra.event_buffer_unknown_24h ?? "—"}
              </p>
            </div>
          )}

          {dataBundle.edgeboard && (
            <div style={{ marginTop: "0.75rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ui.subEdgeboard}</h3>
              {dataBundle.edgeboard.available ? (
                <>
                  <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                    {ui.edgeboardHealth} snapshot {dataBundle.edgeboard.snapshot_ts ?? "—"} · rows{" "}
                    {dataBundle.edgeboard.visible_rows ?? "—"} · symbols {dataBundle.edgeboard.visible_symbols ?? "—"} ·
                    positive {dataBundle.edgeboard.positive_edge_symbols ?? "—"} · avg conf{" "}
                    {dataBundle.edgeboard.avg_confidence != null
                      ? dataBundle.edgeboard.avg_confidence.toFixed(2)
                      : "—"}{" "}
                    · avg edge{" "}
                    {dataBundle.edgeboard.avg_expected_net_edge_bps != null
                      ? `${dataBundle.edgeboard.avg_expected_net_edge_bps.toFixed(1)} bps`
                      : "—"}{" "}
                    · max edge{" "}
                    {dataBundle.edgeboard.max_expected_net_edge_bps != null
                      ? `${dataBundle.edgeboard.max_expected_net_edge_bps.toFixed(1)} bps`
                      : "—"}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                    training_examples_24h: {dataBundle.edgeboard.training_examples_24h ?? "—"} · outcomes_24h:{" "}
                    {dataBundle.edgeboard.outcomes_24h ?? "—"} · model {dataBundle.edgeboard.model_version ?? "—"}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                    {ui.edgeboardTopSignals} {summarizeEdgeboardSignals(dataBundle.edgeboard.top_signals, ui)}
                  </p>
                </>
              ) : (
                <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>{ui.edgeboardUnavailable}</p>
              )}
            </div>
          )}
        </section>
      )}

      {!hasAny && (
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{ui.noDataTitle}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", margin: 0 }}>
            <span dangerouslySetInnerHTML={{ __html: ui.noDataText }} />
          </p>
          <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9375rem" }}>
              → {ui.linkToTier1}
            </Link>
          </p>
        </div>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionA}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            {formatRunHealthPoint(execution.run_health_timeline?.[0] ?? null, ui)}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            {ui.exportLabel}: {execution.exported_at ?? ui.unknownMode} · {ui.symbolsTraded24hLabel}:{" "}
            {execution.symbols_traded_24h != null ? execution.symbols_traded_24h : "—"}
          </p>
        </section>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionB}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 0 }}>
            {execution.epoch_ingest_point
              ? formatEpochIngestPoint(execution.epoch_ingest_point, ui)
              : ui.epochSummaryMissing}
          </p>
        </section>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionC}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {ui.orders24hLabel}{" "}
            <strong style={{ color: "var(--fg)" }}>{execution.orders_24h_count}</strong> · Fills 24h:{" "}
            <strong style={{ color: "var(--fg)" }}>{execution.fills_24h_count}</strong>
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            {ui.orderStatus24hLabel} {summarizeLabelCounts(execution.orders_status_counts_24h, ui)}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            {ui.fillsPerSide24hLabel} {summarizeLabelCounts(execution.fills_side_counts_24h, ui)}
          </p>
        </section>
      )}

      {latency && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionD}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {latency.submit_to_ack_ms_avg != null
              ? `${ui.latencyAvgPrefix}${Math.round(latency.submit_to_ack_ms_avg)} ms (n=${latency.sample_count})`
              : `${ui.latencyNoSamplesPrefix} (n=${latency.sample_count})`}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: 0 }}>
            {ui.histogramLabel}{" "}
            {latency.submit_to_ack_histogram_ms_24h && latency.submit_to_ack_histogram_ms_24h.length > 0
              ? `${latency.submit_to_ack_histogram_ms_24h.length} ${ui.bucketsLabel}`
              : ui.noHistogramAvailable}
          </p>
        </section>
      )}

      {pnl && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionE}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {ui.realizedPnlLabel}{" "}
            {pnl.realized_pnl_quote_24h != null ? pnl.realized_pnl_quote_24h.toFixed(2) : "—"}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            {ui.maxDrawdownLabel}{" "}
            {pnl.drawdown_pct != null ? `${pnl.drawdown_pct.toFixed(2)} %` : ui.na}
          </p>
          {(pnl.sharpe_like_24h != null || pnl.sortino_like_24h != null) && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
              {pnl.sharpe_like_24h != null ? `${ui.sharpeLabel}: ${pnl.sharpe_like_24h.toFixed(3)}` : ""}
              {pnl.sharpe_like_24h != null && pnl.sortino_like_24h != null ? " · " : ""}
              {pnl.sortino_like_24h != null ? `${ui.sortinoLabel}: ${pnl.sortino_like_24h.toFixed(3)}` : ""}
            </p>
          )}
          {pnl.exposure_summary && (
            <>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                {ui.openPositionsLabel} {pnl.exposure_summary.open_positions_count} · long{" "}
                {pnl.exposure_summary.long_positions_count} · short {pnl.exposure_summary.short_positions_count} ·{" "}
                {ui.netExposureLabel} {pnl.exposure_summary.net_base_position.toFixed(6)} · gross{" "}
                {pnl.exposure_summary.gross_base_position.toFixed(6)}
              </p>
              {pnl.exposure_summary.net_entry_notional_quote != null && (
                <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
                  {ui.netEntryNotionalLabel}: {pnl.exposure_summary.net_entry_notional_quote.toFixed(2)}
                </p>
              )}
            </>
          )}
        </section>
      )}

      {safety && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionF}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {ui.normalCountLabel}{" "}
            <strong style={{ color: "var(--fg)" }}>{safety.safety_normal_count}</strong> · {ui.exitOnlyLabel}{" "}
            {safety.safety_exit_only_count} · {ui.hardBlockedLabel} {safety.safety_hard_blocked_count}
          </p>
          {(safety.active_quiets != null || safety.active_hard_blocks != null) && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
              {ui.activeQuietsLabel}: {safety.active_quiets ?? "—"} · {ui.activeHardBlocksLabel}:{" "}
              {safety.active_hard_blocks ?? "—"}
            </p>
          )}
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            {ui.symbolsPerSafetyModeLabel}{" "}
            {safety.symbol_safety_active_modes && safety.symbol_safety_active_modes.length > 0
              ? ui.withPerSymbolSafetyModes(safety.symbol_safety_active_modes.length)
              : ui.noPerSymbolSafetyModes}
          </p>
        </section>
      )}

      <section className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionG}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 0 }}>
          {ui.marketSummaryText}{" "}
          <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {ui.marketSummaryLinkText}
          </Link>{" "}
          {ui.marketSummaryText2}
        </p>
      </section>

      {execution && (
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionH}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            {ui.shadowOutcomeDistributionLabel} {summarizeLabelCounts(execution.shadow_outcome_counts, ui)}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            {ui.shadowMissedMoveHistogramLabel}{" "}
            {summarizeMissedMoves(execution.shadow_missed_move_histogram, ui)}
          </p>
        </section>
      )}

      {execution && (
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{ui.sectionI}</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
            {summarizeEventBuffer(execution.event_buffer_kpis, ui)}
          </p>
        </section>
      )}

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{ui.sectionConceptual}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          {locale === "nl"
            ? "De diagrammen hieronder volgen de SSOT-engine-documentatie. Ze tonen hoe Tier 1, Tier 2 en Tier 3 observability op elkaar aansluiten. De data komt uitsluitend uit read-model snapshots; geen directe DB-query's vanaf de website."
            : locale === "en"
              ? "The diagrams below follow the SSOT engine documentation. They show how Tier 1, Tier 2 and Tier 3 observability connect. The data comes exclusively from read-model snapshots; no direct DB queries from the website."
              : locale === "de"
                ? "Die Diagramme unten folgen der SSOT-Engine-Dokumentation. Sie zeigen, wie Tier 1, Tier 2 und Tier 3 Observability zusammenhängen. Die Daten stammen ausschließlich aus Read-Model-Snapshots; keine direkten DB-Queries von der Website."
                : "Les diagrammes ci-dessous suivent la documentation SSOT de l’engine. Ils montrent comment l’observabilité Tier 1, Tier 2 et Tier 3 s’imbriquent. Les données proviennent exclusivement des snapshots de read-model ; aucune requête DB directe depuis le site."}
        </p>
        {(() => {
          const tier1 =
            locale === "nl"
              ? "Tier 1 (publiek)"
              : locale === "en"
                ? "Tier 1 (public)"
                : locale === "de"
                  ? "Tier 1 (öffentlich)"
                  : "Tier 1 (public)";
          const tier2 =
            locale === "nl"
              ? "Tier 2 (op aanvraag)"
              : locale === "en"
                ? "Tier 2 (on request)"
                : locale === "de"
                  ? "Tier 2 (auf Anfrage)"
                  : "Tier 2 (sur demande)";
          const tier3 =
            locale === "nl"
              ? "Tier 3 (admin)"
              : locale === "en"
                ? "Tier 3 (admin)"
                : locale === "de"
                  ? "Tier 3 (Admin)"
                  : "Tier 3 (admin)";

          const tierFlow = `flowchart LR
  Tier1["${tier1}"] --> Tier2["${tier2}"]
  Tier2 --> Tier3["${tier3}"]

  Tier1 --> SnapPublic["public_* snapshots"]
  Tier2 --> SnapTier2["tier2_* snapshots"]
  Tier3 --> SnapAdmin["admin_observability_snapshot"]`;

          const botFlow = `flowchart TB
  BotEngine["Krakenbot Engine"] --> Export["export-observability-snapshots"]
  Export --> Dir["OBSERVABILITY_EXPORT_DIR"]
  Dir --> SiteTier1["KapitaalBot Observability (Tier 1)"]
  Dir --> SiteTier2["KapitaalBot Observability (Tier 2)"]`;

          return (
            <>
              <MermaidLiveDiagram chart={tierFlow} />
              <MermaidLiveDiagram chart={botFlow} />
            </>
          );
        })()}
      </section>
    </>
  );
}
