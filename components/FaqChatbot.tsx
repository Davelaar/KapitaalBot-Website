"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export function FaqChatbot() {
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMsg: ChatMessage = { id: nextId, role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/faq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error (${res.status})`);
      }
      const data: { answer: string; sources?: string[] } = await res.json();
      const assistantMsg: ChatMessage = {
        id: nextId + 1,
        role: "assistant",
        content: data.answer,
        sources: Array.isArray(data.sources) ? data.sources : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("faq_chat_question");
      }
    } catch (err: any) {
      setError(err.message || t(locale, "faq.chat.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{t(locale, "faq.chat.title")}</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
        {t(locale, "faq.chat.intro")}
      </p>
      <div
        style={{
          maxHeight: "260px",
          overflowY: "auto",
          padding: "0.5rem 0.25rem",
          marginBottom: "0.75rem",
          border: "1px solid var(--border)",
          borderRadius: 8,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            {t(locale, "faq.chat.empty")} <em>"{t(locale, "faq.chat.example")}"</em>
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: "0.5rem",
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.35rem 0.6rem",
                borderRadius: 8,
                background: m.role === "user" ? "var(--accent)" : "var(--card-bg)",
                color: m.role === "user" ? "#0f1419" : "var(--fg)",
                fontSize: "0.875rem",
              }}
            >
              {m.content}
            </div>
            {m.role === "assistant" && m.sources && m.sources.length > 0 && (
              <div style={{ marginTop: "0.35rem", color: "var(--muted)", fontSize: "0.8rem" }}>
                Bronnen:{" "}
                {m.sources.map((slug, i) => (
                  <span key={slug}>
                    <Link href={`/docs/${slug}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                      {slug}
                    </Link>
                    {i < m.sources.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p style={{ color: "#f97373", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(locale, "faq.chat.placeholder")}
          style={{
            flex: 1,
            padding: "0.4rem 0.6rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--fg)",
            fontSize: "0.9rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.4rem 0.9rem",
            background: "var(--accent)",
            color: "#0f1419",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            fontSize: "0.9rem",
          }}
        >
          {loading ? t(locale, "faq.chat.sending") : t(locale, "faq.chat.send")}
        </button>
      </form>
    </section>
  );
}

