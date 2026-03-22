"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";

export function HeaderLogo() {
  const locale = useLocale();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const read = () => {
      const stored = typeof window !== "undefined" && localStorage.getItem("theme") as "light" | "dark" | null;
      const dataTheme = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
      const next = stored ?? dataTheme ?? "dark";
      setTheme(next === "light" ? "light" : "dark");
    };
    read();
    const onThemeChange = (e: Event) => setTheme((e as CustomEvent<"light" | "dark">).detail);
    if (typeof window !== "undefined") {
      window.addEventListener("theme-change", onThemeChange);
      return () => window.removeEventListener("theme-change", onThemeChange);
    }
  }, []);

  /* light theme = donker logo (contrast op lichte achtergrond), dark theme = licht logo */
  const logoSrc = theme === "light" ? "/KapitaalBot.svg" : "/KapitaalBot-light.svg";

  return (
    <a href={withLocale(locale, "/")} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
      <img
        src={logoSrc}
        alt="KapitaalBot"
        style={{ height: "32px", width: "auto", maxWidth: "200px", objectFit: "contain" }}
      />
    </a>
  );
}
