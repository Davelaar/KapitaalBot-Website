import { notFound } from "next/navigation";
import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { locales, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { isKennisSlug, KENNIS_SLUGS } from "@/lib/kennis-slugs";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.flatMap((locale) => KENNIS_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isKennisSlug(params.slug)) return {};
  const locale = parseLocaleParam(params.locale);
  const isNl = locale === "nl";
  return buildPageMetadata({
    locale,
    title: isNl ? `Kennis — ${params.slug} (canoniek)` : `Knowledge — ${params.slug} (canonical)`,
    description: isNl
      ? "Canonieke kennispagina over route-/decision-centric runtime semantiek van KapitaalBot."
      : "Canonical knowledge page about route/decision-centric runtime semantics of KapitaalBot.",
    path: `/kennis/${params.slug}`,
  });
}

type CanonicalArticle = {
  h1: string;
  lead: string;
  definitions: Array<{ term: string; definition: string }>;
  interpretation: string[];
};

function buildArticle(slug: string, locale: Locale): CanonicalArticle | null {
  const isNl = locale === "nl";
  const txt = (nl: string, en: string) => (isNl ? nl : en);

  const baseDefs = [
    {
      term: txt("Route-state", "Route-state"),
      definition: txt(
        "De actuele geaggregeerde besliscontext waarin routes worden beoordeeld op uitvoerbaarheid, timing en risicogeschiktheid.",
        "The current aggregated decision context where routes are evaluated on viability, timing, and risk suitability.",
      ),
    },
    {
      term: txt("Timing-aware ranking", "Timing-aware ranking"),
      definition: txt(
        "Routeprioritering op basis van tijdsgevoeligheid, dataversheid en execution-haalbaarheid, niet op losse signalen.",
        "Route prioritization based on time sensitivity, data freshness, and execution viability, not on isolated signals.",
      ),
    },
    {
      term: txt("Explainability", "Explainability"),
      definition: txt(
        "Publieke oorzaak/gevolg-uitleg waarom routes winnen of worden afgewezen (why-no-trade, route wins, reject reasons).",
        "Public cause/effect explanation of why routes win or are rejected (why-no-trade, route wins, reject reasons).",
      ),
    },
  ];

  const ingestDecisionNote = txt(
    "Let op: ruwe markt-ingest en metrics leven primair op de ingest-pool; execution, safety en order-‘truth’ op de decision-pool. Koppel observability nooit aan de verkeerde database — zie docs 01 (architectuur) en 02 (ingest).",
    "Note: raw market ingest and metrics live primarily on the ingest pool; execution, safety, and order truth live on the decision pool. Never attribute observability to the wrong database — see docs 01 (architecture) and 02 (ingest).",
  );

  const map: Record<string, CanonicalArticle> = {
    "kraken-l3-orderbook-bot": {
      h1: txt("Route-state en marktcontext", "Route-state and market context"),
      lead: txt(
        "Deze pagina definieert hoe marktdatacontext in KapitaalBot functioneel landt als route-state. L2/L3-feeds voeden integriteitscontroles (o.a. checksums) voordat state de strategie-pipeline ingaat.",
        "This page defines how market context lands as route-state. L2/L3 feeds feed integrity checks (including checksums) before state enters the strategy pipeline.",
      ),
      definitions: [
        ...baseDefs.slice(0, 2),
        {
          term: txt("Orderbook-integriteit", "Order book integrity"),
          definition: txt(
            "L2-updates moeten in volgorde verwerkt worden; checksum-mismatch ⇒ resync. Kritieke numerieke paden vermijden float-ronding — zie ook `DECIMAL_F64_POLICY` in de engine-docs.",
            "L2 updates must be processed in order; checksum mismatch ⇒ resync. Critical numeric paths avoid float rounding — see `DECIMAL_F64_POLICY` in the engine docs.",
          ),
        },
        baseDefs[2],
      ],
      interpretation: [
        ingestDecisionNote,
        txt(
          "Gebruik Tier 1 routeboard + Tier 2 ‘Live Route Board’ om zichtbaarheid per symbool × route × horizon te volgen; dat is geen live orderfeed maar geëxporteerde read-models.",
          "Use the Tier 1 route board + Tier 2 ‘Live Route Board’ for visibility per symbol × route × horizon; that is not a live order feed but exported read models.",
        ),
        txt(
          "Diepere technische laag: `02_DATA_INGEST`, `03_STRATEGY_PIPELINE` en `07_OBSERVABILITY` in `/docs`.",
          "Deeper technical layer: `02_DATA_INGEST`, `03_STRATEGY_PIPELINE`, and `07_OBSERVABILITY` under `/docs`.",
        ),
      ],
    },
    "kraken-websocket-api-spot": {
      h1: txt("Websocket-first runtime en dataflow", "Websocket-first runtime and dataflow"),
      lead: txt(
        "KapitaalBot verwerkt data als langdurige WebSocket-keten richting state en routebeslissingen. REST is strikt beperkt (o.a. WebSockets-token); trading en user-data lopen via WS v2.",
        "KapitaalBot processes data as long-lived WebSocket chains toward state and route decisions. REST is strictly limited (e.g. WebSockets token); trading and user data use WS v2.",
      ),
      definitions: [
        ...baseDefs,
        {
          term: txt("Reconnect-gedrag", "Reconnect behaviour"),
          definition: txt(
            "Na reconnect: nieuwe auth-token, opnieuw subscriben, snapshots waar vereist (L2/L3), en reconcile vanuit exchange-‘truth’ (o.a. executions-kanaal).",
            "After reconnect: new auth token, resubscribe, snapshots where required (L2/L3), and reconcile from exchange truth (including the executions channel).",
          ),
        },
      ],
      interpretation: [
        ingestDecisionNote,
        txt(
          "Publieke observability toont de functionele keten (freshness, tellers, aggregates), niet interne multiplex-details of venue-rate-limits.",
          "Public observability shows the functional chain (freshness, counters, aggregates), not internal multiplex details or venue rate limits.",
        ),
        txt(
          "Zie `01_ARCHITECTURE` en `02_DATA_INGEST` voor het plaatje van processen ↔ DB-pools.",
          "See `01_ARCHITECTURE` and `02_DATA_INGEST` for processes ↔ DB pools.",
        ),
      ],
    },
    "kraken-hybrid-maker-fees": {
      h1: txt("Execution-kwaliteit en fill feedback", "Execution quality and fill feedback"),
      lead: txt(
        "Execution-uitkomsten en fills zijn de waarheid voor order lifecycle; WS-method responses zijn hooguit ACK’s. Publiek zie je geaggregeerde kwaliteit (statusverdeling, fill-kant, latency), geen order-level tuning.",
        "Execution outcomes and fills are the source of truth for order lifecycle; WS method responses are at best ACKs. Publicly you see aggregated quality (status mix, fill side, latency), not order-level tuning.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Orders/fills worden persistent op de decision-pool vastgelegd; combineer nooit blind met ingest-only tabellen.",
          "Orders/fills are persisted on the decision pool; never blindly join with ingest-only tables.",
        ),
        txt(
          "Lees fillkwaliteit als operationele effectmeting richting route-evaluatie, niet als signaal om strategie te klonen.",
          "Read fill quality as operational measurement toward route evaluation, not as a signal to copy the strategy.",
        ),
        txt(
          "Zie `04_EXECUTION_ORDERS` en `05_PROTECTION_EXIT` voor lifecycle en bescherming rond posities.",
          "See `04_EXECUTION_ORDERS` and `05_PROTECTION_EXIT` for lifecycle and position protection.",
        ),
      ],
    },
    "crypto-regime-detectie": {
      h1: txt("Regime-routering en multistrategy-selectie", "Regime routing and multistrategy selection"),
      lead: txt(
        "Regime en strategie worden samengebracht in de pipeline vóór execution: ze bepalen welke routefamilies überhaupt in aanmerking komen — niet als decoratieve labels op een chart.",
        "Regime and strategy are combined in the pipeline before execution: they determine which route families are even eligible — not as decorative labels on a chart.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Het systeem kiest routes vanuit context, timing en geschiktheid; het doel is gecontroleerde uitlegbaarheid, niet maximale tradefrequentie.",
          "The system chooses routes from context, timing, and suitability; the goal is controlled explainability, not maximum trade frequency.",
        ),
        txt(
          "Dashboard toont regime-/strategy-samenvattingen uit snapshots; voor canonieke definities: `03_STRATEGY_PIPELINE` en module-inventaris.",
          "The dashboard shows regime/strategy summaries from snapshots; for canonical definitions: `03_STRATEGY_PIPELINE` and the module inventory.",
        ),
      ],
    },
    "live-execution-transparency": {
      h1: txt("Why-No-Trade en route explainability", "Why-No-Trade and route explainability"),
      lead: txt(
        "Publieke transparantie focust op beslisuitkomsten: funnel-stages, reject-redenen, edgeboard-rangorde — niet op replay van ruwe signalen.",
        "Public transparency focuses on decision outcomes: funnel stages, reject reasons, edgeboard ranking — not replay of raw signals.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Tier 2 bundle (`tier2_data_bundle`) aggregeert o.a. why-no-trade en route-context; interpreteer altijd met de juiste pool-labels (ingest vs decision) zoals in de engine-docs beschreven.",
          "The Tier 2 bundle (`tier2_data_bundle`) aggregates why-no-trade and route context; always interpret with correct pool labels (ingest vs decision) as in the engine docs.",
        ),
        txt(
          "Combineer met FAQ (secties observability & validatie) en dashboard voor cause→effect-debugging.",
          "Combine with the FAQ (observability & validation sections) and the dashboard for cause→effect debugging.",
        ),
      ],
    },
    "veilige-kraken-api-bot": {
      h1: txt("Safety, position-context en risicogrenzen", "Safety, position context, and risk boundaries"),
      lead: txt(
        "Safety-modi (normal / exit-only / hard-blocked) en position-context zijn harde guards vóór nieuwe risk: ze zijn bedoeld om trade te stoppen wanneer data of markt onbetrouwbaar is.",
        "Safety modes (normal / exit-only / hard-blocked) and position context are hard guards before new risk: meant to stop trading when data or the market is unreliable.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "`symbol_safety_state` en gerelateerde views horen canoniek op de decision-pool; publieke tiles tonen aggregaten, geen per-account overrides.",
          "`symbol_safety_state` and related views belong on the decision pool canonically; public tiles show aggregates, not per-account overrides.",
        ),
        txt(
          "Zie `06_RISK_SAFETY` voor capital allocator, quiet windows en circuit-breaker-semantiek in woorden.",
          "See `06_RISK_SAFETY` for the capital allocator, quiet windows, and circuit-breaker semantics in prose.",
        ),
      ],
    },
    "low-latency-crypto-execution-nl": {
      h1: txt("Timing, latency-klassen en execution viability", "Timing, latency classes, and execution viability"),
      lead: txt(
        "Timing is first-class: submit→ack, fill→exit-submit en feed-freshness bepalen of een route überhaupt uitvoerbaar is. Hot/warm/cold zijn functionele klassen, geen marketinglabels.",
        "Timing is first-class: submit→ack, fill→exit-submit, and feed freshness determine whether a route is viable. Hot/warm/cold are functional classes, not marketing labels.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Tier 2 toont latency-histogrammen wanneer de export die buckets bevat; anders blijven gemiddelden leidend — zie FAQ observability.",
          "Tier 2 shows latency histograms when the export includes those buckets; otherwise averages lead — see the observability FAQ.",
        ),
        txt(
          "Zie SPEC (`/spec`) voor latency-doelen en `07_OBSERVABILITY` voor metrics/snapshots.",
          "See SPEC (`/spec`) for latency targets and `07_OBSERVABILITY` for metrics and snapshots.",
        ),
      ],
    },
  };

  return map[slug] ?? null;
}

export default async function KennisArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isKennisSlug(params.slug)) notFound();
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";
  const article = buildArticle(params.slug, locale);
  if (!article) notFound();

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", fontSize: "0.875rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {isNl ? "Home" : "Home"}
        </Link>
        <span style={{ color: "var(--muted)" }}>/</span>
        <Link href={withLocale(locale, "/kennis")} className="kb-text-link">
          {isNl ? "Kennis" : "Knowledge"}
        </Link>
      </nav>
      <article className="card" style={{ padding: "1.25rem 1.5rem", maxWidth: "72ch" }}>
        <h1 style={{ fontSize: "1.65rem", marginBottom: "0.75rem", fontWeight: 600 }}>{article.h1}</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "1rem", marginBottom: "1.25rem" }}>{article.lead}</p>

        <h2 style={{ fontSize: "1.12rem", marginBottom: "0.5rem" }}>
          {isNl ? "Kernbegrippen" : "Core definitions"}
        </h2>
        <div style={{ display: "grid", gap: "0.65rem", marginBottom: "1rem" }}>
          {article.definitions.map((d) => (
            <div key={d.term} className="card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: "0.98rem", marginBottom: "0.25rem" }}>{d.term}</h3>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, fontSize: "0.91rem" }}>{d.definition}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "1.12rem", marginBottom: "0.5rem" }}>
          {isNl ? "Interpretatie voor operators en bezoekers" : "Interpretation for operators and visitors"}
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.94rem" }}>
          {article.interpretation.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          <Link href={withLocale(locale, "/kennis")} className="kb-text-link">
            ← {isNl ? "Kennis" : "Knowledge"}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/dashboard")} className="kb-text-link">
            {isNl ? "Dashboard" : "Dashboard"}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/spec")} className="kb-text-link">
            SPEC
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/docs")} className="kb-text-link">
            {isNl ? "Docs" : "Docs"}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/faq")} className="kb-text-link">
            FAQ
          </Link>
        </p>
      </article>
    </main>
  );
}
