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

  const map: Record<string, CanonicalArticle> = {
    "kraken-l3-orderbook-bot": {
      h1: txt("Route-state en marktcontext", "Route-state and market context"),
      lead: txt(
        "Deze pagina definieert hoe marktdatacontext in KapitaalBot functioneel landt als route-state.",
        "This page defines how market context in KapitaalBot functionally lands as route-state.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Gebruik dashboard + Tier2 om te zien hoe context leidt tot routekeuzes zonder private implementatiedetails.",
          "Use dashboard + Tier2 to see how context leads to route choices without private implementation details.",
        ),
      ],
    },
    "kraken-websocket-api-spot": {
      h1: txt("Websocket-first runtime en dataflow", "Websocket-first runtime and dataflow"),
      lead: txt(
        "KapitaalBot verwerkt data als langdurige websocketgedreven keten richting routebeslissingen en observability-export.",
        "KapitaalBot processes data as a long-lived websocket-driven chain towards route decisions and observability export.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Publieke observability toont de functionele keten, niet de broncode of latency-workarounds.",
          "Public observability shows the functional chain, not source code or latency workarounds.",
        ),
      ],
    },
    "kraken-hybrid-maker-fees": {
      h1: txt("Execution-kwaliteit en fill feedback", "Execution quality and fill feedback"),
      lead: txt(
        "Execution-uitkomsten worden publiek geaggregeerd getoond als kwaliteits- en feedbacksignalen richting route-evaluatie.",
        "Execution outcomes are publicly shown in aggregated form as quality and feedback signals for route evaluation.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Lees fillkwaliteit als operationele effectmeting, niet als private tuning- of allocatie-informatie.",
          "Read fill quality as operational effect measurement, not as private tuning or allocation information.",
        ),
      ],
    },
    "crypto-regime-detectie": {
      h1: txt("Regime-routering en multistrategy-selectie", "Regime routing and multistrategy selection"),
      lead: txt(
        "Regime en strategie worden in de canonieke laag beschreven als context voor route-selectie, niet als losse botlabels.",
        "Regime and strategy are described in the canonical layer as context for route selection, not as isolated bot labels.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Het systeem kiest routes vanuit context en timing; het doel is uitlegbaarheid, niet tradefrequentie.",
          "The system selects routes from context and timing; the goal is explainability, not trade frequency.",
        ),
      ],
    },
    "live-execution-transparency": {
      h1: txt("Why-No-Trade en route explainability", "Why-No-Trade and route explainability"),
      lead: txt(
        "Publieke transparantie focust op decision outcomes: waarom niet gehandeld is, en waarom een route won.",
        "Public transparency focuses on decision outcomes: why no trade happened, and why a route won.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Gebruik deze pagina samen met FAQ en dashboard voor diagnose op oorzaak/gevolg-niveau.",
          "Use this page together with FAQ and dashboard for cause/effect-level diagnostics.",
        ),
      ],
    },
    "veilige-kraken-api-bot": {
      h1: txt("Safety, position-context en risicogrenzen", "Safety, position context, and risk boundaries"),
      lead: txt(
        "Safety wordt publiek beschreven als functionele grenslaag rond routebeslissingen en positiecontext.",
        "Safety is publicly described as a functional boundary layer around route decisions and position context.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Publieke safety-data is geaggregeerd; private account- en allocatiedetails blijven admin-only.",
          "Public safety data is aggregated; private account and allocation details remain admin-only.",
        ),
      ],
    },
    "low-latency-crypto-execution-nl": {
      h1: txt("Timing, latency-klassen en execution viability", "Timing, latency classes, and execution viability"),
      lead: txt(
        "Timing is first-class in KapitaalBot: latency wordt functioneel geïnterpreteerd in hot/warm/cold paden.",
        "Timing is first-class in KapitaalBot: latency is interpreted functionally across hot/warm/cold paths.",
      ),
      definitions: baseDefs,
      interpretation: [
        txt(
          "Zie SPEC voor target/observed/why-it-matters latencystructuur en dashboard voor actuele observability.",
          "See SPEC for target/observed/why-it-matters latency structure and dashboard for current observability.",
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
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {isNl ? "Home" : "Home"}
        </Link>
        <span style={{ color: "var(--muted)" }}>/</span>
        <Link href={withLocale(locale, "/kennis")} style={{ color: "var(--accent)", textDecoration: "none" }}>
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
          <Link href={withLocale(locale, "/kennis")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← {isNl ? "Kennis" : "Knowledge"}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {isNl ? "Dashboard" : "Dashboard"}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/spec")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            SPEC
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/docs")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {isNl ? "Docs" : "Docs"}
          </Link>
          {" · "}
          <Link href={withLocale(locale, "/faq")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            FAQ
          </Link>
        </p>
      </article>
    </main>
  );
}
