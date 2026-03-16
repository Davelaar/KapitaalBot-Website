"use client";

import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function DashboardIntro() {
  const locale = useLocale();
  return (
    <>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        {t(locale, "nav.data")}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
        {t(locale, "dashboard.intro")}
      </p>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.8125rem" }}>
        {t(locale, "dashboard.intro2")}
      </p>
    </>
  );
}
