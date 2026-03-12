import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Changelog — KapitaalBot",
  description: "Recente wijzigingen aan de observability-website en de trading engine.",
};

export default function ChangelogPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Changelog</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Laatste wijzigingen aan de observability-site en de engine (samenvatting).
      </p>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Website (maart 2026)</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, color: "var(--muted)", fontSize: "0.9375rem" }}>
          <li>Changelog-pagina toegevoegd; link in navigatie.</li>
          <li>Finalisatie: freshness-indicator (GOOD/WARN/STALE), null handling (Awaiting bot export…).</li>
          <li>Dashboard: extra metric cards (Safety Hard Blocks, L3 %, Regime Switches 1h, Drawdown severity), sorteerbare markttabel, regime stacked bar.</li>
          <li>Homepage: hero “Live Trading Observability Engine”, secties Waarom KapitaalBot, How Observability Works, Tier Access Model.</li>
          <li>Tier2-aanvraag: POST /api/tier2-request → data/tier2_requests.json, rate limit, form loading/success.</li>
          <li>Compliance-banner vertaald via cookie (NL/EN/DE/FR).</li>
          <li>Admin: snapshot-status + raw JSON viewer (Tier 3).</li>
          <li>SEO: OG/twitter, robots.txt, sitemap.xml, JSON-LD. Analytics (Plausible/Umami via env).</li>
          <li>Error boundaries (error.tsx, global-error.tsx).</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Engine / Bot (technische highlights)</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          Samenvatting op basis van KRAKENBOTMAART docs; voor volledige technische changelog zie de bot-repository.
        </p>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, color: "var(--muted)", fontSize: "0.9375rem" }}>
          <li><strong style={{ color: "var(--fg)" }}>Route Decision Engine v2</strong> — Market-first route engine: market features → expected path → route expectancy → winner (route×horizon×entry×exit) of NoTrade; shadow/counterfactual logging.</li>
          <li><strong style={{ color: "var(--fg)" }}>Observability export</strong> — JSON-snapshots voor website BFF (geen directe DB); OBSERVABILITY_SNAPSHOT_CONTRACT.</li>
          <li><strong style={{ color: "var(--fg)" }}>Safety</strong> — WS-native safety (latency, watchdog, exit-only, hard-block); symbol_safety_state; ws_safety_report.</li>
          <li><strong style={{ color: "var(--fg)" }}>Epoch / Ingest</strong> — Lineage, execution_universe_snapshots, ingest/execution split (EXECUTION_ONLY).</li>
          <li><strong style={{ color: "var(--fg)" }}>Deterministic lifecycle</strong> — DB-first, OrderTracker, fills_ledger, 13 states.</li>
        </ul>
      </section>

      <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
        Volledige website-changelog: <code style={{ fontSize: "0.875em" }}>docs/CHANGELOG_FINALISATIE.md</code> in de repo.
      </p>
    </main>
  );
}
