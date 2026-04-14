import Link from "next/link";
import { MermaidLiveDiagram } from "@/components/MermaidLiveDiagram";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: t(locale, "spec.meta.title"),
    description: t(locale, "spec.meta.desc"),
    path: "/spec",
    keywords: t(locale, "spec.meta.keywords"),
  });
}

export default async function SpecPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;

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
          ← {t(locale, "spec.nav.back")}
        </Link>
      </nav>

      <h1 style={{ fontSize: "1.9rem", marginBottom: "0.5rem" }}>
        {t(locale, "spec.h1")}
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: "78ch", lineHeight: 1.65 }}>
        {t(locale, "spec.intro")}
      </p>
      <p style={{ color: "var(--muted)", maxWidth: "78ch", lineHeight: 1.65, marginTop: "0.75rem" }}>
        {t(locale, "spec.deeper.intro")}{" "}
        <Link href={withLocale(locale, "/docs/DOC_INDEX")} className="kb-text-link">
          {t(locale, "docs.meta.DOC_INDEX.label")}
        </Link>
        {" · "}
        <Link href={withLocale(locale, "/docs/01_ARCHITECTURE")} className="kb-text-link">
          {t(locale, "docs.meta.01_ARCHITECTURE.label")}
        </Link>
      </p>

      <section className="card" style={{ marginTop: "1rem", padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
          {t(locale, "spec.h2.stack")}
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
          {t(locale, "spec.h2.runtime")}
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          {t(locale, "spec.runtime.body")}
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.65, marginTop: "0.65rem" }}>
          {t(locale, "spec.runtime.pools")}
        </p>
        <div className="markdown-body" style={{ marginTop: "0.75rem" }}>
          <MermaidLiveDiagram chart={runtimeDiagram} seoKeyPrefix="spec.runtime.diagram" />
        </div>
      </section>

      <section className="card" style={{ marginTop: "1rem", padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
          {t(locale, "spec.h2.latency")}
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          {t(locale, "spec.latency.intro")}
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
          {t(locale, "spec.h2.boundary")}
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--muted)", lineHeight: 1.7 }}>
          <li>{t(locale, "spec.boundary.yes")}</li>
          <li>{t(locale, "spec.boundary.no")}</li>
        </ul>
      </section>
    </main>
  );
}
