"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/dashboard/tier2";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard/tier2";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t(locale, "login.error"));
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError(t(locale, "login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <div className="card" style={{ maxWidth: "360px" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{t(locale, "login.title")}</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "1.25rem" }}>
          {t(locale, "login.intro")}
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-code" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}>
            {t(locale, "login.placeholder")}
          </label>
          <input
            id="login-code"
            type="password"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--fg)",
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
          />
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
            }}
          >
            {loading ? "…" : t(locale, "login.submit")}
          </button>
        </form>
      </div>
    </main>
  );
}
