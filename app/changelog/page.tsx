import Link from "next/link";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function getLocaleFromCookieStore(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Locale {
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

export async function generateMetadata() {
  // Intentionally omitted to avoid hardcoding metadata titles in the wrong language.
  // The visible UI strings on this page are localized via `ui` below.
  return {};
}

export default async function ChangelogPage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieStore(cookieStore);

  const ui = {
    nl: {
      sectionWebsite: "Website (maart 2026)",
      sectionEngine: "Engine / Bot (technische highlights)",
      navBack: "Home",
      title: "Changelog",
      intro: "Laatste wijzigingen aan de observability-site en de engine (samenvatting).",
      bulletsWebsite: [
        "Changelog-pagina toegevoegd; link in navigatie.",
        "Finalisatie: freshness-indicator (GOOD/WARN/STALE), null handling (Awaiting bot export…).",
        "Dashboard: extra metric cards (Safety Hard Blocks, L3 %, Regime Switches 1h, Drawdown severity), sorteerbare markttabel, regime stacked bar.",
        'Homepage: hero “Live Trading Observability Engine”, secties Waarom KapitaalBot, Hoe Observability Werkt, Tier-toegangsmodel.',
        "Tier2-aanvraag: POST /api/tier2-request → data/tier2_requests.json, rate limit, form loading/success.",
        "Compliance-banner vertaald via cookie (NL/EN/DE/FR).",
        "Admin: snapshot-status + raw JSON viewer (Tier 3).",
        "SEO: OG/twitter, robots.txt, sitemap.xml, JSON-LD. Analytics (Plausible/Umami via env).",
        "Error boundaries (error.tsx, global-error.tsx).",
      ],
      bulletsEngine: [
        { head: "Route Decision Engine v2", body: "Market-first route engine: market features → expected path → route expectancy → winner (route×horizon×entry×exit) of NoTrade; shadow/counterfactual logging." },
        { head: "Observability export", body: "JSON-snapshots voor website BFF (geen directe DB); OBSERVABILITY_SNAPSHOT_CONTRACT." },
        { head: "Safety", body: "WS-native safety (latency, watchdog, exit-only, hard-block); symbol_safety_state; ws_safety_report." },
        { head: "Epoch / Ingest", body: "Lineage, execution_universe_snapshots, ingest/execution split (EXECUTION_ONLY)." },
        { head: "Deterministic lifecycle", body: "DB-first, OrderTracker, fills_ledger, 13 states." },
      ],
      foot: "Volledige website-changelog: docs/CHANGELOG_FINALISATIE.md in de repo.",
      summaryNote:
        "Samenvatting op basis van KRAKENBOTMAART docs; voor volledige technische changelog zie de bot-repository.",
    },
    en: {
      sectionWebsite: "Website (March 2026)",
      sectionEngine: "Engine / Bot (technical highlights)",
      navBack: "Home",
      title: "Changelog",
      intro: "Recent updates to the observability website and the trading engine (summary).",
      bulletsWebsite: [
        "Changelog page added; link in navigation.",
        "Finalization: freshness indicator (GOOD/WARN/STALE), null handling (Awaiting bot export…).",
        "Dashboard: extra metric cards (Safety Hard Blocks, L3 %, Regime Switches 1h, Drawdown severity), sortable market table, regime stacked bar.",
        'Homepage: hero “Live Trading Observability Engine”, sections Why KapitaalBot, How Observability Works, Tier Access Model.',
        "Tier2 request: POST /api/tier2-request → data/tier2_requests.json, rate limit, form loading/success.",
        "Compliance banner translated via cookie (NL/EN/DE/FR).",
        "Admin: snapshot status + raw JSON viewer (Tier 3).",
        "SEO: OG/twitter, robots.txt, sitemap.xml, JSON-LD. Analytics (Plausible/Umami via env).",
        "Error boundaries (error.tsx, global-error.tsx).",
      ],
      bulletsEngine: [
        { head: "Route Decision Engine v2", body: "Market-first route engine: market features → expected path → route expectancy → winner (route×horizon×entry×exit) or NoTrade; shadow/counterfactual logging." },
        { head: "Observability export", body: "JSON snapshots for the website BFF (no direct DB); OBSERVABILITY_SNAPSHOT_CONTRACT." },
        { head: "Safety", body: "WS-native safety (latency, watchdog, exit-only, hard-block); symbol_safety_state; ws_safety_report." },
        { head: "Epoch / Ingest", body: "Lineage, execution_universe_snapshots, ingest/execution split (EXECUTION_ONLY)." },
        { head: "Deterministic lifecycle", body: "DB-first, OrderTracker, fills_ledger, 13 states." },
      ],
      foot: "Full website changelog: docs/CHANGELOG_FINALISATIE.md in the repo.",
      summaryNote:
        "Summary based on KRAKENBOTMAART docs; for the full technical changelog see the bot repository.",
    },
    de: {
      sectionWebsite: "Website (März 2026)",
      sectionEngine: "Engine / Bot (technische Highlights)",
      navBack: "Start",
      title: "Changelog",
      intro: "Aktuelle Änderungen an der Observability-Website und der Trading-Engine (Zusammenfassung).",
      bulletsWebsite: [
        "Changelog-Seite hinzugefügt; Link in der Navigation.",
        "Finalisierung: Freshness-Indikator (GOOD/WARN/STALE), Null-Handling (Awaiting bot export…).",
        "Dashboard: zusätzliche Metrik-Karten (Safety Hard Blocks, L3 %, Regime Switches 1h, Drawdown severity), sortierbare Markttabelle, Regime-Stacked-Bar.",
        'Homepage: Hero “Live Trading Observability Engine”, Bereiche Warum KapitaalBot, Wie Observability funktioniert, Tier-Zugangsmodell.',
        "Tier2-Anfrage: POST /api/tier2-request → data/tier2_requests.json, Rate-Limit, Form Loading/Success.",
        "Compliance-Banner über Cookie übersetzt (NL/EN/DE/FR).",
        "Admin: Snapshot-Status + einfacher Raw-JSON-Viewer (Tier 3).",
        "SEO: OG/Twitter, robots.txt, sitemap.xml, JSON-LD. Analytics (Plausible/Umami über env).",
        "Error Boundaries (error.tsx, global-error.tsx).",
      ],
      bulletsEngine: [
        { head: "Route Decision Engine v2", body: "Market-first Route-Engine: market features → expected path → route expectancy → winner (route×horizon×entry×exit) oder NoTrade; Shadow/Counterfactual-Logging." },
        { head: "Observability export", body: "JSON-Snapshots für die Website-BFF (keine direkte DB); OBSERVABILITY_SNAPSHOT_CONTRACT." },
        { head: "Safety", body: "WS-natives Safety (latency, watchdog, exit-only, hard-block); symbol_safety_state; ws_safety_report." },
        { head: "Epoch / Ingest", body: "Lineage, execution_universe_snapshots, ingest/execution split (EXECUTION_ONLY)." },
        { head: "Deterministic lifecycle", body: "DB-first, OrderTracker, fills_ledger, 13 Zustände." },
      ],
      foot: "Vollständiger Website-Changelog: docs/CHANGELOG_FINALISATIE.md im Repo.",
      summaryNote:
        "Zusammenfassung basierend auf KRAKENBOTMAART-Dokumenten; für den vollständigen technischen Changelog siehe das Bot-Repository.",
    },
    fr: {
      sectionWebsite: "Site (mars 2026)",
      sectionEngine: "Engine / Bot (points techniques)",
      navBack: "Accueil",
      title: "Changelog",
      intro: "Mises à jour récentes du site d’observabilité et du moteur de trading (résumé).",
      bulletsWebsite: [
        "Page Changelog ajoutée ; lien dans la navigation.",
        "Finalisation : indicateur de fraîcheur (GOOD/WARN/STALE), gestion des valeurs null (Awaiting bot export…).",
        "Dashboard : cartes de métriques supplémentaires (Safety Hard Blocks, L3 %, Regime Switches 1h, Drawdown severity), tableau marché triable, barres empilées par régime.",
        'Accueil : hero “Live Trading Observability Engine”, sections Pourquoi KapitaalBot, Comment fonctionne l’observabilité, Modèle d’accès par tier.',
        "Demande Tier2 : POST /api/tier2-request → data/tier2_requests.json, rate limit, chargement/succès du formulaire.",
        "Bannière compliance traduite via cookie (NL/EN/DE/FR).",
        "Admin : statut de snapshot + visualiseur JSON brut (Tier 3).",
        "SEO : OG/twitter, robots.txt, sitemap.xml, JSON-LD. Analytics (Plausible/Umami via env).",
        "Error boundaries (error.tsx, global-error.tsx).",
      ],
      bulletsEngine: [
        { head: "Route Decision Engine v2", body: "Moteur de décision orienté marché : market features → expected path → route expectancy → winner (route×horizon×entry×exit) ou NoTrade ; logging shadow/counterfactual." },
        { head: "Observability export", body: "Snapshots JSON pour le site BFF (pas de DB directe) ; OBSERVABILITY_SNAPSHOT_CONTRACT." },
        { head: "Safety", body: "Safety native WS (latency, watchdog, exit-only, hard-block) ; symbol_safety_state ; ws_safety_report." },
        { head: "Epoch / Ingest", body: "Lineage, execution_universe_snapshots, split ingest/execution (EXECUTION_ONLY)." },
        { head: "Deterministic lifecycle", body: "DB-first, OrderTracker, fills_ledger, 13 états." },
      ],
      foot: "Changelog complet du site : docs/CHANGELOG_FINALISATIE.md dans le repo.",
      summaryNote:
        "Résumé basé sur les docs KRAKENBOTMAART ; pour le changelog technique complet voir le dépôt du bot.",
    },
  }[locale];

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {ui.navBack}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{ui.title}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{ui.intro}</p>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{ui.sectionWebsite}</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, color: "var(--muted)", fontSize: "0.9375rem" }}>
          {ui.bulletsWebsite.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{ui.sectionEngine}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          {ui.summaryNote}
        </p>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, color: "var(--muted)", fontSize: "0.9375rem" }}>
          {ui.bulletsEngine.map((b, i) => (
            <li key={i}>
              <strong style={{ color: "var(--fg)" }}>{b.head}</strong> — {b.body}
            </li>
          ))}
        </ul>
      </section>

      <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
        {ui.foot} <code style={{ fontSize: "0.875em" }}>docs/CHANGELOG_FINALISATIE.md</code>
      </p>
    </main>
  );
}
