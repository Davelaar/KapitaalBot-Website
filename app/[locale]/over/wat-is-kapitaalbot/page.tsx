import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  const isNl = locale === "nl";
  const base = getSiteUrl().replace(/\/+$/, "");
  const ogImage = `${base}/images/over/wat-is-kapitaalbot-desktop.jpg`;
  const meta = buildPageMetadata({
    locale,
    title: isNl
      ? "Wat is KapitaalBot? — canonieke definitie"
      : "What is KapitaalBot? — canonical definition",
    description: isNl
      ? "KapitaalBot is een timing-aware multistrategy multiregime route-selection engine met route-state, explainability en position-context."
      : "KapitaalBot is a timing-aware multistrategy multiregime route-selection engine with route-state, explainability, and position context.",
    path: "/over/wat-is-kapitaalbot",
    keywords: isNl
      ? "KapitaalBot definitie, route-selection engine, timing-aware trading runtime, explainability"
      : "KapitaalBot definition, route-selection engine, timing-aware trading runtime, explainability",
  });
  const heroAlt = isNl
    ? "Infographic: van ruwe marktdata via filters, blocker-chain en explainability naar zeldzame execution-kansen."
    : "Infographic: from raw market data through filters, a blocker chain, and explainability to rare execution opportunities.";
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: ogImage, width: 1024, height: 558, alt: heroAlt }],
    },
    twitter: {
      ...meta.twitter,
      images: [ogImage],
    },
  };
}

export default async function WatIsKapitaalbotPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";
  const pStyle = {
    color: "var(--muted)",
    lineHeight: 1.65 as const,
    fontSize: "0.9375rem",
    marginBottom: "1rem",
  };
  const h2Style = {
    fontSize: "1.2rem",
    marginTop: "1.75rem",
    marginBottom: "0.75rem",
    fontWeight: 600 as const,
  };
  const listStyle = { ...pStyle, paddingLeft: "1.25rem", marginTop: 0, marginBottom: "0.25rem" };

  const heroAlt = isNl
    ? "Infographic: van ruwe marktdata via filters, blocker-chain en explainability naar zeldzame execution-kansen."
    : "Infographic: from raw market data through filters, a blocker chain, and explainability to rare execution opportunities.";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.25rem 2.5rem" }}>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/over")} className="kb-text-link" style={{ fontSize: "0.9rem" }}>
          ← {isNl ? "Over KapitaalBot" : "About KapitaalBot"}
        </Link>
      </nav>

      <article>
        <figure className="wat-is-kapitaalbot-hero">
          <picture>
            <source media="(max-width: 767px)" type="image/webp" srcSet="/images/over/wat-is-kapitaalbot-mobile.webp" />
            <source media="(max-width: 767px)" srcSet="/images/over/wat-is-kapitaalbot-mobile.jpg" />
            <source type="image/webp" srcSet="/images/over/wat-is-kapitaalbot-desktop.webp" />
            <img
              src="/images/over/wat-is-kapitaalbot-desktop.jpg"
              alt={heroAlt}
              width={1024}
              height={558}
              decoding="async"
            />
          </picture>
        </figure>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}>
          {isNl ? "Wat is KapitaalBot?" : "What is KapitaalBot?"}
        </h1>
        <p style={{ ...pStyle, fontSize: "1rem", color: "var(--fg)" }}>
          {isNl
            ? "KapitaalBot is geen eenvoudige momentum- of scalpingbot. Het is een timing-aware, multistrategy, multiregime route-selection engine."
            : "KapitaalBot is not a simple momentum or scalping bot. It is a timing-aware, multistrategy, multiregime route-selection engine."}
        </p>

        <h2 style={h2Style}>{isNl ? "Canonieke definitie" : "Canonical definition"}</h2>
        <ul style={listStyle}>
          <li>{isNl ? "Timing-aware ranking van routekandidaten." : "Timing-aware ranking of route candidates."}</li>
          <li>{isNl ? "Multistrategy en multiregime context als beslisinput." : "Multistrategy and multiregime context as decision input."}</li>
          <li>{isNl ? "Route-state als operationele waarheid voor observability." : "Route-state as operational truth for observability."}</li>
          <li>{isNl ? "Explainability via why-no-trade, route wins en reject reasons." : "Explainability through why-no-trade, route wins, and reject reasons."}</li>
          <li>{isNl ? "Position-context en safety als randvoorwaarden voor execution." : "Position context and safety as execution boundary conditions."}</li>
        </ul>

        <h2 style={h2Style}>{isNl ? "Wat KapitaalBot niet is" : "What KapitaalBot is not"}</h2>
        <ul style={listStyle}>
          <li>{isNl ? "Geen single-strategy indicatorbot." : "Not a single-strategy indicator bot."}</li>
          <li>{isNl ? "Geen symbol/feed-first dashboardmodel als hoofdwaarheid." : "Not a symbol/feed-first dashboard model as primary truth."}</li>
          <li>{isNl ? "Geen publieke broncode of reproduceerbare private tuninglaag." : "No public source code or reproducible private tuning layer."}</li>
          <li>{isNl ? "Geen beleggingsadvies of signaaldienst." : "Not investment advice or a signaling service."}</li>
        </ul>

        <h2 style={h2Style}>{isNl ? "Hoe deze pagina past in de canon" : "How this page fits the canon"}</h2>
        <p style={pStyle}>
          {isNl
            ? "Deze pagina geeft de kern-definitie. Voor operationele observability gebruik je Dashboard. Voor stack/latency gebruik je SPEC. Voor contractuele details gebruik je Docs. Voor oorzaak/gevolg-vragen gebruik je FAQ."
            : "This page provides the core definition. For operational observability, use Dashboard. For stack/latency, use SPEC. For contractual details, use Docs. For cause/effect questions, use FAQ."}
        </p>

        <p style={{ ...pStyle, marginTop: "1.25rem", fontSize: "0.9rem" }}>
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
          {" · "}
          <Link href={withLocale(locale, "/kennis")} className="kb-text-link">
            {isNl ? "Kennis" : "Knowledge"}
          </Link>
        </p>
      </article>
    </main>
  );
}
