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

  const debugName = (error as any)?.name ?? "NO_NAME";
  const debugMessage = error?.message ?? "NO_MESSAGE";
  const debugDigest = (error as any)?.digest ?? "NO_DIGEST";

  return (
    <main>
      <div className="card" style={{ maxWidth: "480px" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{t(locale, "global.error.title")}</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          {t(locale, "global.error.message")}
        </p>
        <pre
          style={{
            marginTop: "0.25rem",
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "0.85rem",
            color: "#cbd5e1",
          }}
        >
DEBUG_ERROR
name: {debugName}
message: {debugMessage}
digest: {debugDigest}
        </pre>
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
