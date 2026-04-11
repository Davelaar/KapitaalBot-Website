"use client";

import { useEffect } from "react";

/**
 * Loads a stylesheet without blocking first paint (Lighthouse "render-blocking").
 * Uses print media swap; applies as `all` once loaded.
 */
export function DeferredStylesheet({ href }: { href: string }) {
  useEffect(() => {
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = href;
    el.media = "print";
    el.onload = () => {
      el.media = "all";
    };
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [href]);
  return null;
}
