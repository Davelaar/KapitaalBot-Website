"use client";

import { useEffect, useState } from "react";

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

/** Kraken horizontal wordmark — white SVG on dark UI, color PNG on light UI (official CMS assets). */
export function CockpitKrakenMark({ ariaLabel }: { ariaLabel: string }) {
  const theme = useSiteTheme();
  const src = theme === "light" ? "/brands/kraken-wordmark-color.png" : "/brands/kraken-wordmark-white.svg";

  return (
    <a
      href="https://www.kraken.com"
      target="_blank"
      rel="noopener noreferrer"
      className="cockpit-kraken-link"
      aria-label={ariaLabel}
    >
      <img src={src} alt="" width={360} height={100} className="cockpit-kraken-img" decoding="async" />
    </a>
  );
}
