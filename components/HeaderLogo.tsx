"use client";

import { useEffect, useState } from "react";

export function HeaderLogo() {
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

  const logoSrc = theme === "light" ? "/KapitaalBot-light.svg" : "/KapitaalBot.svg";

  return (
    <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
      <img
        src={logoSrc}
        alt="KapitaalBot"
        style={{ height: "32px", width: "auto", maxWidth: "200px", objectFit: "contain" }}
      />
    </a>
  );
}
