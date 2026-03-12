"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <div className="card" style={{ maxWidth: "480px" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>Er is iets misgegaan</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          De pagina kon niet worden geladen. Probeer het opnieuw.
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
          Opnieuw proberen
        </button>
      </div>
    </main>
  );
}
