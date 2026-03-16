"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function Tier2RequestForm() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const reason = (form.elements.namedItem("reason") as HTMLTextAreaElement)?.value?.trim();

    if (!email || !email.includes("@")) {
      setError(t(locale, "access.form.error_email"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tier2-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason: reason || "" }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? t(locale, "access.form.error_generic"));
        return;
      }
      setSuccess(true);
      form.reset();
      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("tier2_request_submitted");
      }
    } catch {
      setError(t(locale, "access.form.error_network"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ maxWidth: "420px" }}>
        <p style={{ margin: 0, color: "var(--freshness-good)", fontWeight: 600 }}>
          {t(locale, "access.form.success")}
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: "420px" }}>
      <form
        onSubmit={handleSubmit}
        aria-label={t(locale, "access.title")}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="tier2-email"
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {t(locale, "access.form.email")}
          </label>
          <input
            id="tier2-email"
            type="email"
            name="email"
            required
            placeholder={t(locale, "access.form.placeholder_email")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--fg)",
              fontSize: "1rem",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="tier2-reason"
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {t(locale, "access.form.reason")}
          </label>
          <textarea
            id="tier2-reason"
            name="reason"
            rows={4}
            placeholder={t(locale, "access.form.placeholder_reason")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--fg)",
              fontSize: "1rem",
              resize: "vertical",
            }}
          />
        </div>
        {error && (
          <p style={{ margin: "0 0 0.75rem", color: "var(--freshness-stale)", fontSize: "0.875rem" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1.25rem",
            background: "var(--accent)",
            color: "#0f1419",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.9375rem",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? t(locale, "access.form.loading") : t(locale, "access.form.submit")}
        </button>
      </form>
    </div>
  );
}
