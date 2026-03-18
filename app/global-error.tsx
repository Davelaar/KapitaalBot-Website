// global-error is rendered on the client (error boundary), so keep it as a client component
"use client";

import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const title = t(locale, "global.error.title");
  const message = t(locale, "global.error.message");
  const retry = t(locale, "global.error.retry");

  return (
    <html lang={locale}>
      <body style={{ margin: 0, fontFamily: "system-ui", padding: "2rem", background: "#0f1419", color: "#e6edf3" }}>
        <h1 style={{ fontSize: "1.25rem" }}>{title}</h1>
        <p style={{ color: "#8b949e" }}>{message}</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#2dd4bf",
            color: "#0f1419",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {retry}
        </button>
      </body>
    </html>
  );
}
