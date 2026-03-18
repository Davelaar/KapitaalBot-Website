"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <div className="card" style={{ maxWidth: "480px" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{t(locale, "global.error.title")}</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          {t(locale, "global.error.message")}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--accent)",
            color: "#0f1419",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t(locale, "global.error.retry")}
        </button>
      </div>
    </main>
  );
}
