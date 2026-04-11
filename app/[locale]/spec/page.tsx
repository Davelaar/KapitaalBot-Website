import Link from "next/link";
import { MermaidLiveDiagram } from "@/components/MermaidLiveDiagram";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  const isNl = locale === "nl";
  return buildPageMetadata({
    locale,
    title: isNl ? "SPEC — KapitaalBot Runtime Specificatie" : "SPEC — KapitaalBot Runtime Specification",
    description: isNl
      ? "Canonieke technische specificatie van stack, runtime-architectuur en latencyprofiel van KapitaalBot."
      : "Canonical technical specification of KapitaalBot stack, runtime architecture, and latency profile.",
    path: "/spec",
    keywords: isNl
      ? "KapitaalBot spec, Rust trading bot, runtime architecture, latency tiers, observability"
      : "KapitaalBot spec, Rust trading bot, runtime architecture, latency tiers, observability",
  });
}

export default async function SpecPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";

  const runtimeDiagram = `flowchart LR
  Ingest["Ingest State"] --> Route["Route Ranking"]
  Route --> Choke["Execution Choke"]
  Choke --> Exec["Execution"]
  Exec --> Feedback["Fill Feedback"]
  Feedback --> Route
  Route --> Explain["Explainability + Observability"]`;

  return (
    <main>
      <nav style={{ marginBottom: "1.25rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {isNl ? "Home" : "Home"}
        </Link>
      </nav>

      <h1 style={{ fontSize: "1.9rem", marginBottom: "0.5rem" }}>
        {isNl ? "SPEC: KapitaalBot Runtime" : "SPEC: KapitaalBot Runtime"}
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: "78ch", lineHeight: 1.65 }}>
        {isNl
          ? "Deze pagina is de canonieke publieke technische specificatie van KapitaalBot. De focus ligt op systeemgedrag, operationele architectuur en latency-eisen. Broncode, gevoelige tuningwaarden en private accountdetails blijven bewust buiten scope."
          : "This page is the canonical public technical specification of KapitaalBot. It focuses on system behavior, operational architecture, and latency requirements. Source code, sensitive tuning values, and private account details remain intentionally out of scope."}
      </p>

      <section className="card" style={{ marginTop: "1rem", padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
          {isNl ? "1) Gebruikte techniek / stack" : "1) Technology stack"}
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                {["Component", "Spec", "Public note"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.4rem", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Language", "Rust", "Core runtime and execution logic"],
                ["Databases", "PostgreSQL", "Role-separated data paths (ingest / decision / research where applicable)"],
                ["OS / Runtime", "Linux (Ubuntu class)", "Service-oriented runtime on dedicated host(s)"],
                ["Process control", "systemd services", "Deterministic startup/restart and health supervision"],
                ["Exchange integration", "WebSocket-first", "Live market + execution channels, snapshot/export driven website"],
                ["Observability export", "Read-model JSON snapshots", "Public and tiered observability without direct DB exposure"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)" }}><strong>{r[0]}</strong></td>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)" }}>{r[1]}</td>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: "1rem", padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
          {isNl ? "2) Runtime / architecture specs" : "2) Runtime / architecture specs"}
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          {isNl
            ? "KapitaalBot werkt als timing-aware, multistrategy route-selection engine met live route-state, regime-routering, position-context, execution choke en feedbackgedreven explainability."
            : "KapitaalBot operates as a timing-aware multistrategy route-selection engine with live route-state, regime routing, position context, execution choke, and feedback-driven explainability."}
        </p>
        <div className="markdown-body" style={{ marginTop: "0.75rem" }}>
          <MermaidLiveDiagram chart={runtimeDiagram} seoKeyPrefix="spec.runtime.diagram" />
        </div>
      </section>

      <section className="card" style={{ marginTop: "1rem", padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
          {isNl ? "3) Latency specification" : "3) Latency specification"}
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          {isNl
            ? "Onderstaand overzicht maakt expliciet onderscheid tussen latency-targets, geobserveerde ranges en vertraagde/background-paden."
            : "The table below explicitly distinguishes latency targets, observed ranges, and delayed/background paths."}
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr>
                {["Tier / Path", "Target latency", "Observed latency", "Why it matters"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.4rem", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Hot path (ranking → choke → submit)", "Sub-second class", "Runtime-dependent, monitored continuously", "Direct impact on execution viability and stale-decision risk"],
                ["Warm path (route-state refresh, explainability updates)", "Seconds class", "Low-seconds class under normal load", "Controls decision freshness and interpretability"],
                ["Tier 1 public observability", "Delayed by design", "Delayed snapshots", "Prevents real-time strategy leakage while preserving transparency"],
                ["Tier 2 analytical observability", "Near-operational delay", "Snapshot cadence dependent", "Supports deep diagnostics without exposing account-sensitive internals"],
                ["Tier 3/admin and private operator paths", "Operationally immediate", "Internal-only", "Used for sensitive account/runtime control and forensic analysis"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)" }}><strong>{r[0]}</strong></td>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)" }}>{r[1]}</td>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)" }}>{r[2]}</td>
                  <td style={{ padding: "0.4rem", borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: "1rem", padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
          {isNl ? "4) Public safety boundary" : "4) Public safety boundary"}
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--muted)", lineHeight: 1.7 }}>
          <li>{isNl ? "WEL: functionele werking, architectuur, beslislogica op hoog niveau, outcomes, explainability." : "YES: functional behavior, architecture, high-level decision logic, outcomes, explainability."}</li>
          <li>{isNl ? "NIET: broncode, exacte private thresholds, gevoelige allocator/sizing details, accountspecifieke data." : "NO: source code, exact private thresholds, sensitive allocator/sizing details, account-specific data."}</li>
        </ul>
      </section>
    </main>
  );
}
