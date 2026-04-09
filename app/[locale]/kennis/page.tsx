import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { KENNIS_SLUGS } from "@/lib/kennis-slugs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  const isNl = locale === "nl";
  return buildPageMetadata({
    locale,
    title: isNl
      ? "Kennisbank — KapitaalBot route-/decision-canon"
      : "Knowledge Base — KapitaalBot route/decision canon",
    description: isNl
      ? "Canonieke kennisbank met definities van route-state, timing-aware ranking, regime-routing, position-context en explainability."
      : "Canonical knowledge base with definitions for route-state, timing-aware ranking, regime routing, position context, and explainability.",
    path: "/kennis",
  });
}

export default async function KennisHubPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";

  const titleBySlug: Record<(typeof KENNIS_SLUGS)[number], string> = {
    "kraken-l3-orderbook-bot": isNl
      ? "Route-state en marktcontext"
      : "Route-state and market context",
    "kraken-websocket-api-spot": isNl
      ? "Websocket-first runtime en dataflow"
      : "Websocket-first runtime and dataflow",
    "kraken-hybrid-maker-fees": isNl
      ? "Execution-kwaliteit en fill feedback"
      : "Execution quality and fill feedback",
    "crypto-regime-detectie": isNl
      ? "Regime-routering en multistrategy-selectie"
      : "Regime routing and multistrategy selection",
    "live-execution-transparency": isNl
      ? "Why-No-Trade en route explainability"
      : "Why-No-Trade and route explainability",
    "veilige-kraken-api-bot": isNl
      ? "Safety, position-context en risicogrenzen"
      : "Safety, position context, and risk boundaries",
    "low-latency-crypto-execution-nl": isNl
      ? "Timing, latency-klassen en execution viability"
      : "Timing, latency classes, and execution viability",
  };

  const descBySlug: Record<(typeof KENNIS_SLUGS)[number], string> = {
    "kraken-l3-orderbook-bot": isNl
      ? "Definitie van live route-state, input-context en hoe dit zichtbaar wordt in observability."
      : "Definition of live route-state, input context, and how it appears in observability.",
    "kraken-websocket-api-spot": isNl
      ? "Functionele keten van ingest naar decision en export, zonder broncode of private tuningdetails."
      : "Functional chain from ingest to decision and export, without source code or private tuning details.",
    "kraken-hybrid-maker-fees": isNl
      ? "Uitleg van execution outcomes, fillkwaliteit en feedback naar route-evaluatie."
      : "Explanation of execution outcomes, fill quality, and feedback into route evaluation.",
    "crypto-regime-detectie": isNl
      ? "Hoe multiregime/multistrategy selectie in de canonieke semantiek wordt geïnterpreteerd."
      : "How multiregime/multistrategy selection is interpreted in canonical semantics.",
    "live-execution-transparency": isNl
      ? "Publieke oorzaakanalyse: waarom geen trade, waarom deze route won."
      : "Public cause analysis: why no trade, why this route won.",
    "veilige-kraken-api-bot": isNl
      ? "Safety-modes, protection-context en wat publiek zichtbaar blijft versus admin-only."
      : "Safety modes, protection context, and what remains public versus admin-only.",
    "low-latency-crypto-execution-nl": isNl
      ? "Hot/warm/cold paden, target vs observed latency en waarom timing kritische waarde heeft."
      : "Hot/warm/cold paths, target vs observed latency, and why timing matters critically.",
  };

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {isNl ? "Home" : "Home"}
        </Link>
      </nav>
      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          {isNl ? "Kennisbank (canoniek)" : "Knowledge Base (canonical)"}
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", lineHeight: 1.65 }}>
          {isNl
            ? "Deze kennisbank is de publieke, AI-leesbare semantische laag van KapitaalBot. De inhoud volgt exact dezelfde definities als dashboard, SPEC, docs en FAQ."
            : "This knowledge base is the public, AI-readable semantic layer of KapitaalBot. It follows the same definitions as dashboard, SPEC, docs, and FAQ."}
        </p>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", lineHeight: 1.65, marginTop: "0.75rem" }}>
          {isNl
            ? "Focus: wat het systeem doet en waarom. Geen broncode, geen private accountdetails, geen reproduceerbare fine-tuning."
            : "Focus: what the system does and why. No source code, no private account details, no reproducible fine-tuning."}
        </p>
        <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
          {KENNIS_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={withLocale(locale, `/kennis/${slug}`)}
              className="card"
              style={{ display: "block", padding: "1rem 1.25rem", textDecoration: "none", color: "inherit" }}
            >
              <h2 style={{ fontSize: "1.1rem", marginBottom: "0.35rem", color: "var(--fg)" }}>
                {titleBySlug[slug]}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                {descBySlug[slug]}
              </p>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {isNl ? "Dashboard" : "Dashboard"} →
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
