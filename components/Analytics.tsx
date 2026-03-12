"use client";

import Script from "next/script";

/**
 * Privacy-friendly analytics: Plausible or Umami.
 * Enable via NEXT_PUBLIC_PLAUSIBLE_DOMAIN or NEXT_PUBLIC_UMAMI_WEBSITE_ID.
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

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

  return null;
}
