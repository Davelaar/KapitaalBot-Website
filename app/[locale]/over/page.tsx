import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import type { Locale } from "@/lib/i18n";

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
    title: isNl ? "Over KapitaalBot — context en scope" : "About KapitaalBot — context and scope",
    description: isNl
      ? "Contextpagina: waarom KapitaalBot bestaat, wat publiek is, en hoe de canonieke runtime-pagina's samenhangen."
      : "Context page: why KapitaalBot exists, what is public, and how canonical runtime pages fit together.",
    path: "/over",
    keywords: isNl
      ? "KapitaalBot context, publieke documentatie, runtime scope, route-selection engine"
      : "KapitaalBot context, public documentation, runtime scope, route-selection engine",
  });
}

export default async function OverPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";
  const pStyle = { color: "var(--muted)", lineHeight: 1.65 as const, fontSize: "0.9375rem", marginBottom: "1rem" };
  const h2Style = { fontSize: "1.2rem", marginTop: "1.75rem", marginBottom: "0.75rem", fontWeight: 600 as const };
  const ctaBtn = {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--card-bg)",
    color: "var(--fg)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 600,
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.25rem 2.5rem" }}>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← {isNl ? "Systeem" : "System"}
        </Link>
      </nav>

      <article>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}>
          {isNl ? "Over KapitaalBot" : "About KapitaalBot"}
        </h1>
        <p style={{ ...pStyle, fontSize: "1rem", color: "var(--fg)" }}>
          {isNl
            ? "Deze pagina geeft context en scope. De canonieke runtime-definitie staat op 'Wat is KapitaalBot'."
            : "This page provides context and scope. The canonical runtime definition is on 'What is KapitaalBot'."}
        </p>

        <h2 style={h2Style}>{isNl ? "Waarom deze publieke laag bestaat" : "Why this public layer exists"}</h2>
        <p style={pStyle}>
          {isNl
            ? "KapitaalBot publiceert functionele waarheid over runtimegedrag, observability en besluituitkomsten. Het doel is technische transparantie zonder broncode of reproduceerbare private tuning vrij te geven."
            : "KapitaalBot publishes functional truth about runtime behavior, observability, and decision outcomes. The goal is technical transparency without exposing source code or reproducible private tuning."}
        </p>

        <h2 style={h2Style}>{isNl ? "Publiek versus private scope" : "Public versus private scope"}</h2>
        <p style={pStyle}>
          {isNl
            ? "Publiek: architectuur, definities, explainability, why-no-trade, route-wins, geaggregeerde operationele uitkomsten. Private/admin: accountniveau balances, gevoelige PnL-details, exacte thresholds en fine-tuning."
            : "Public: architecture, definitions, explainability, why-no-trade, route wins, aggregated operational outcomes. Private/admin: account-level balances, sensitive PnL details, exact thresholds, and fine-tuning."}
        </p>
        <ul style={{ ...pStyle, paddingLeft: "1.25rem", marginTop: 0 }}>
          <li style={{ marginBottom: "0.65rem" }}>
            {isNl
              ? "Functioneel volledig begrijpen wat het systeem doet en waarom."
              : "Functionally understand what the system does and why."}
          </li>
          <li>
            {isNl
              ? "Geen 1-op-1 kopieerbaarheid zonder substantiële eigen R&D."
              : "No 1:1 reproducibility without substantial own R&D."}
          </li>
        </ul>

        <h2 style={h2Style}>{isNl ? "Canonieke paginahiërarchie" : "Canonical page hierarchy"}</h2>
        <p style={pStyle}>
          {isNl
            ? "Gebruik de pagina's in deze volgorde: definitie -> specificatie -> observability -> contractdocs -> FAQ."
            : "Use pages in this order: definition -> specification -> observability -> contract docs -> FAQ."}
        </p>
        <p style={pStyle}>
          {isNl
            ? "Zo blijft semantiek consistent voor bezoekers, operators en AI-systemen."
            : "This keeps semantics consistent for visitors, operators, and AI systems."}
        </p>

        <p style={{ ...pStyle, marginTop: "1.5rem", fontStyle: "italic" }}>
          {isNl
            ? "Kort: context staat hier; canonieke runtime-waarheid staat op de gespecialiseerde pagina's."
            : "In short: context lives here; canonical runtime truth lives on the specialized pages."}
        </p>

        <div
          className="card"
          style={{
            marginTop: "2rem",
            padding: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <span style={{ width: "100%", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
            {isNl ? "Canonieke ingangen" : "Canonical entry points"}
          </span>
          <Link href={withLocale(locale, "/over/wat-is-kapitaalbot")} style={{ ...ctaBtn, borderColor: "var(--accent)", color: "var(--accent)" }}>
            {isNl ? "Wat is KapitaalBot?" : "What is KapitaalBot?"}
          </Link>
          <Link href={withLocale(locale, "/spec")} style={ctaBtn}>
            SPEC
          </Link>
          <Link href={withLocale(locale, "/dashboard")} style={ctaBtn}>
            {isNl ? "Dashboard" : "Dashboard"}
          </Link>
          <Link href={withLocale(locale, "/docs")} style={ctaBtn}>
            {isNl ? "Docs" : "Docs"}
          </Link>
          <Link href={withLocale(locale, "/faq")} style={ctaBtn}>
            FAQ
          </Link>
        </div>
      </article>
    </main>
  );
}
