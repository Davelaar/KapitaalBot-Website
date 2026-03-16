import Link from "next/link";
import { cookies } from "next/headers";
import { t, type Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";

type TierGateKind = "tier2" | "tier3";

interface TierGateProps {
  kind: TierGateKind;
}

function getLocaleFromCookies(cookieStore: Awaited<ReturnType<typeof cookies>>): Locale {
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

export async function TierGate({ kind }: TierGateProps) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const titleKey = kind === "tier2" ? "tier_gate.tier2.title" : "tier_gate.tier3.title";
  const messageKey = kind === "tier2" ? "tier_gate.tier2.message" : "tier_gate.tier3.message";

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
              href="/tier2-request"
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
            href={kind === "tier2" ? "/login?next=/dashboard/tier2" : "/login?next=/admin"}
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
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9375rem", alignSelf: "center" }}>
            ← {t(locale, "nav.home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
