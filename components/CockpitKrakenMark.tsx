"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { cockpitT } from "@/lib/dashboard-cockpit-i18n";

const COCKPIT_NARROW_MQ = "(max-width: 640px)";

const KRAKEN_INVITE_URL = "https://invite.kraken.com/JDNW/n1342zfo";
const KRAKEN_REFERRAL_CODE = "2ttwcy3g";

function useSiteTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return theme;
}

function useNarrowCockpit(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(COCKPIT_NARROW_MQ);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

/**
 * Kraken mark in cockpit hero: vier assets — desktop vs mobile (`≤640px`) en light vs dark theme.
 */
export function CockpitKrakenMark({ ariaLabel, locale }: { ariaLabel: string; locale: Locale }) {
  const theme = useSiteTheme();
  const narrow = useNarrowCockpit();

  const src = narrow
    ? theme === "light"
      ? "/brands/kraken_mobile.webp"
      : "/brands/kraken_mobile_dark.webp"
    : theme === "light"
      ? "/brands/kraken.webp"
      : "/brands/kraken_dark.webp";

  const intrinsic = narrow
    ? { width: 1290, height: 1302 }
    : { width: 1292, height: 204 };

  return (
    <div className="cockpit-kraken-stack">
      <a
        href="https://www.kraken.com"
        target="_blank"
        rel="noopener noreferrer"
        className="cockpit-kraken-link"
        aria-label={ariaLabel}
      >
        <img
          src={src}
          alt=""
          width={intrinsic.width}
          height={intrinsic.height}
          className={`cockpit-kraken-img${narrow ? " cockpit-kraken-img--mobile" : ""}`}
          decoding="async"
        />
      </a>
      <p className="cockpit-kraken-referral">
        {cockpitT(locale, "krakenReferralPrefix")}{" "}
        <code className="cockpit-kraken-referral__code">{KRAKEN_REFERRAL_CODE}</code>{" "}
        {cockpitT(locale, "krakenReferralMid")}{" "}
        <a
          href={KRAKEN_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="cockpit-kraken-referral__link"
          aria-label={cockpitT(locale, "krakenReferralLinkAria")}
        >
          {cockpitT(locale, "krakenReferralLinkText")}
        </a>
        .
      </p>
    </div>
  );
}
