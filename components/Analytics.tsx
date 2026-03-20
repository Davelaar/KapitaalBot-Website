"use client";

import Script from "next/script";
import type { Locale } from "@/lib/i18n";
import { getKapitaalbotGaMeasurementId } from "@/lib/analytics";

/**
 * Analytics priority:
 * 1. Plausible — `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
 * 2. Umami — `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
 * 3. GA4 — `public/analytics/kapitaalbot-analytics.js` (consent, 4 languages); default ID G-TLP1NT0CYH
 *
 * Disable GA only: `NEXT_PUBLIC_GA_DISABLE=1`
 */
export function Analytics({ locale }: { locale: Locale }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const gaId = getKapitaalbotGaMeasurementId();

  if (plausibleDomain) {
    return (
      <Script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  if (umamiId) {
    return (
      <Script
        async
        src="https://analytics.umami.is/script.js"
        data-website-id={umamiId}
        strategy="afterInteractive"
      />
    );
  }

  if (gaId) {
    return (
      <>
        <Script id="kapitaalbot-analytics-locale" strategy="beforeInteractive">
          {`window.__KAPITAALBOT_LOCALE__=${JSON.stringify(locale)};`}
        </Script>
        <Script
          src="/analytics/kapitaalbot-analytics.js"
          strategy="afterInteractive"
          data-measurement-id={gaId}
        />
      </>
    );
  }

  return null;
}
