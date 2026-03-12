"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, fontFamily: "system-ui", padding: "2rem", background: "#0f1419", color: "#e6edf3" }}>
        <h1 style={{ fontSize: "1.25rem" }}>Fout</h1>
        <p style={{ color: "#8b949e" }}>Er is een fout opgetreden. Probeer de pagina te vernieuwen.</p>
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
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
