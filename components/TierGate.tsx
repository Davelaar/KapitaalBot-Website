import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/locale-path";

type TierGateKind = "tier2" | "tier3";

interface TierGateProps {
  kind: TierGateKind;
  locale: Locale;
}

export async function TierGate({ kind, locale }: TierGateProps) {
  const titleKey = kind === "tier2" ? "tier_gate.tier2.title" : "tier_gate.tier3.title";
  const messageKey = kind === "tier2" ? "tier_gate.tier2.message" : "tier_gate.tier3.message";

  const nextPath = kind === "tier2" ? "/dashboard/tier2" : "/admin";
  const loginHref = `${withLocale(locale, "/login")}?next=${encodeURIComponent(withLocale(locale, nextPath))}`;

  return (
    <main>
      <div className="card" style={{ maxWidth: "480px" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{t(locale, titleKey)}</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          {t(locale, messageKey)}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {kind === "tier2" && (
            <Link
              href={withLocale(locale, "/tier2-request")}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--accent)",
                color: "#0f1419",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9375rem",
              }}
            >
              {t(locale, "tier_gate.request_access")}
            </Link>
          )}
          <Link
            href={loginHref}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid var(--border)",
              color: "var(--fg)",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.9375rem",
            }}
          >
            {t(locale, "tier_gate.login")}
          </Link>
          <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9375rem", alignSelf: "center" }}>
            ← {t(locale, "nav.home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
