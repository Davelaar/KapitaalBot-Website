"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefers = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const next = stored ?? prefers;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        padding: "0.35rem 0.75rem",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        background: "var(--card-bg)",
        color: "var(--fg)",
        cursor: "pointer",
        fontSize: "0.875rem",
      }}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
