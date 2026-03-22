"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function ContactPageContent() {
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : t(locale, "contact.form.errorGeneric"));
        return;
      }
      setDone(true);
      setMessage("");
    } catch {
      setError(t(locale, "contact.form.errorNetwork"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "contact.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{t(locale, "contact.intro")}</p>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
        {t(locale, "contact.donationNote")}{" "}
        <Link href="/faq#funding" style={{ color: "var(--accent)", textDecoration: "underline" }}>
          {t(locale, "contact.donationFaqLink")}
        </Link>
      </p>

      <section className="card" style={{ marginBottom: "1.25rem", padding: "1.25rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>{t(locale, "contact.form.heading")}</h2>
        {done ? (
          <p style={{ margin: 0, color: "var(--freshness-good)" }}>{t(locale, "contact.form.success")}</p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.9rem" }}>
              <span>{t(locale, "contact.form.name")}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--fg)",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.9rem" }}>
              <span>{t(locale, "contact.form.email")} *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--fg)",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.9rem" }}>
              <span>{t(locale, "contact.form.message")} *</span>
              <textarea
                required
                minLength={10}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--fg)",
                  resize: "vertical",
                }}
              />
            </label>
            {error && <p style={{ margin: 0, color: "var(--freshness-stale)", fontSize: "0.9rem" }}>{error}</p>}
            <button
              type="submit"
              disabled={busy}
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                border: "none",
                background: "var(--accent)",
                color: "#0f1419",
                fontWeight: 700,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.8 : 1,
              }}
            >
              {busy ? t(locale, "contact.form.sending") : t(locale, "contact.form.submit")}
            </button>
          </form>
        )}
      </section>

      <section className="card" style={{ marginBottom: "1rem", padding: "1rem 1.25rem" }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
          {t(locale, "contact.accessNote")}{" "}
          <Link href="/tier2-request" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            {t(locale, "contact.accessLink")}
          </Link>
        </p>
      </section>

      <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>{t(locale, "contact.footer")}</p>
    </main>
  );
}
