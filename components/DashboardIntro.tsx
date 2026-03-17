"use client";

import { useLocale } from "@/lib/locale";
import { t, type Locale } from "@/lib/i18n";
import type { PublicStatusSnapshot } from "@/lib/snapshots";
import { formatDelaySeconds } from "@/lib/snapshot-freshness";

export function DashboardIntro({
  status = null,
  locale: localeProp,
}: {
  status?: PublicStatusSnapshot | null;
  locale?: Locale;
}) {
  const localeFromHook = useLocale();
  const locale = localeProp ?? localeFromHook;
  const delaySecs = status?.data_freshness_secs ?? null;

  return (
    <>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        {t(locale, "nav.data")}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
        {t(locale, "dashboard.intro")}
      </p>
      <p style={{ color: "var(--muted)", marginBottom: delaySecs != null ? "0.5rem" : "1.5rem", fontSize: "0.8125rem" }}>
        {t(locale, "dashboard.intro2")}
      </p>
      {delaySecs != null && (
        <p style={{ color: "var(--accent)", marginBottom: "1.5rem", fontSize: "0.9375rem", fontWeight: 600 }}>
          {t(locale, "dashboard.delayPrefix")}
          <span style={{ fontFamily: "monospace" }}>ca. {formatDelaySeconds(delaySecs)}</span>
        </p>
      )}
    </>
  );
}
