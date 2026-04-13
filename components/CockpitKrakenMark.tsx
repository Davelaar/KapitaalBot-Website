"use client";

import { useEffect, useState } from "react";

const COCKPIT_NARROW_MQ = "(max-width: 640px)";

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
export function CockpitKrakenMark({ ariaLabel }: { ariaLabel: string }) {
  const theme = useSiteTheme();
  const narrow = useNarrowCockpit();

  const src = narrow
    ? theme === "light"
      ? "/brands/kraken-cockpit-mobile-light.jpg"
      : "/brands/kraken-cockpit-mobile-dark.jpg"
    : theme === "light"
      ? "/brands/kraken-cockpit-desktop-light.jpg"
      : "/brands/kraken-cockpit-desktop-dark.jpg";

  const intrinsic = narrow
    ? { width: 1015, height: 1024 }
    : { width: 1024, height: 162 };

  return (
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
  );
}
