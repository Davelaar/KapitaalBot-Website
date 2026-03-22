"use client";

import Link from "next/link";
import { MermaidLiveDiagram } from "@/components/MermaidLiveDiagram";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import type {
  EventBufferKpis,
  LabelCount,
  MissedMoveBucket,
  RunHealthPoint,
  Tier2ExecutionSnapshot,
  Tier2LatencySnapshot,
  Tier2PnlSnapshot,
  Tier2SafetySnapshot,
} from "@/lib/snapshots";

interface DashboardTier2ContentProps {
  execution: Tier2ExecutionSnapshot | null;
  latency: Tier2LatencySnapshot | null;
  pnl: Tier2PnlSnapshot | null;
  safety: Tier2SafetySnapshot | null;
}

function formatRunHealthPoint(p: RunHealthPoint | null | undefined, ui: any): string {
  if (!p) return ui.noRunHealthSample;
  const freshness = p.feed_freshness_secs != null ? `${Math.round(p.feed_freshness_secs)} s` : "n.v.t.";
  const freshnessLabel = freshness === "n.v.t." ? ui.na : freshness;
  return `${ui.runWord} ${p.run_id} · ${ui.modeLabel}=${p.mode ?? ui.unknownMode} · ${ui.feedFreshnessLabel} ~${freshnessLabel}`;
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
  return `buffered=${kpis.buffered_count}, released=${kpis.released_count}, timed_out=${kpis.timed_out_count}, unknown=${kpis.unknown_state_count}`;
}

export function DashboardTier2Content({ execution, latency, pnl, safety }: DashboardTier2ContentProps) {
  const locale = useLocale();
  const ui = {
    nl: {
      navBack: "Dashboard",
      title: "Dashboard Tier 2",
      intro:
        "Uitgebreide observability uit <code>tier2_*</code> snapshots. Echte data; geen placeholders.",
      noDataTitle: "Geen Tier 2-data",
      noDataText:
        "Er zijn nog geen <code>tier2_*</code> snapshot-bestanden. Voer op de bot <code>export-observability-snapshots</code> uit; daarna verschijnen hier de modules.",
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
      sectionConceptual: "Tier-model & dataflow (conceptueel)",
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
    },
    en: {
      navBack: "Dashboard",
      title: "Tier 2 Dashboard",
      intro:
        "Extended observability from <code>tier2_*</code> snapshots. Real data; no placeholders.",
      noDataTitle: "No Tier 2 data",
      noDataText:
        "There are no <code>tier2_*</code> snapshot files yet. Run <code>export-observability-snapshots</code> on the bot; modules will appear here afterwards.",
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
      sectionConceptual: "Tier model & dataflow (conceptual)",
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
      sectionConceptual: "Tier-Modell & Datenfluss (konzeptionell)",
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
      sectionConceptual: "Modèle de tiers & flux de données (conceptuel)",
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
    },
  }[locale];

  const hasAny =
    execution !== null || latency !== null || pnl !== null || safety !== null;

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
              ? `${ui.epochWord} ${execution.epoch_ingest_point.epoch_id ?? ui.na} · ${ui.epochSymbolsOkExpectedLabel}${execution.epoch_ingest_point.symbols_ok ?? "?"}/${execution.epoch_ingest_point.symbols_expected ?? "?"} · ${ui.validLabel}${
                  execution.epoch_ingest_point.is_valid === null ? ui.na : execution.epoch_ingest_point.is_valid ? ui.yes : ui.no
                }`
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
          {pnl.exposure_summary && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: 0 }}>
              {ui.openPositionsLabel} {pnl.exposure_summary.open_positions_count} ({ui.exitOnlyCountLabel}{" "}
              {pnl.exposure_summary.exit_only_positions_count}, {ui.hardBlockedCountLabel}{" "}
              {pnl.exposure_summary.hard_blocked_positions_count}); {ui.netExposureLabel}{" "}
              {pnl.exposure_summary.net_base_position_s ?? ui.na}
            </p>
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
