"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { userQuestionsLookSimilar } from "@/lib/faq-question-similarity";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

function sourceToDocSlug(source: string): string {
  const cleaned = source.replace(/^docs\//, "").replace(/\.md$/i, "");
  return cleaned;
}

function findSimilarAssistantReply(messages: ChatMessage[], question: string): ChatMessage | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const u = messages[i];
    if (u.role !== "user") continue;
    if (!userQuestionsLookSimilar(question, u.content)) continue;
    const a = messages[i + 1];
    if (a && a.role === "assistant") return a;
  }
  return null;
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

    const cached = findSimilarAssistantReply(messages, question);
    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMsg: ChatMessage = { id: nextId, role: "user", content: question };
    setInput("");
    setLoading(true);
    setError(null);

    if (cached) {
      const dupMsg: ChatMessage = {
        id: nextId + 1,
        role: "assistant",
        content: `${t(locale, "faq.chat.duplicateHint")}\n\n${cached.content}`,
        sources: cached.sources,
      };
      setMessages((prev) => [...prev, userMsg, dupMsg]);
      setLoading(false);
      return;
    }

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/faq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `Server error (${res.status})`);
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
    <section className="card kb-faq-assistant" style={{ marginBottom: "1.5rem" }}>
      <h2 className="kb-faq-assistant-title" style={{ fontSize: "1.25rem", marginBottom: "0.35rem" }}>
        {t(locale, "faq.search.title")}
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.85rem", lineHeight: 1.55 }}>
        {t(locale, "faq.search.lead")}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem" }}>
        <input
          type="search"
          name="faq-query"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(locale, "faq.chat.placeholder")}
          aria-label={t(locale, "faq.search.title")}
          style={{
            flex: 1,
            padding: "0.55rem 0.65rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--fg)",
            fontSize: "0.95rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="kb-btn-solid-brand kb-btn-solid-brand--compact"
          style={{ cursor: loading ? "default" : "pointer" }}
        >
          {loading ? t(locale, "faq.chat.sending") : t(locale, "faq.chat.send")}
        </button>
      </form>
      <div
        style={{
          maxHeight: "min(52vh, 420px)",
          overflowY: "auto",
          padding: "0.5rem 0.25rem",
          marginBottom: "0.5rem",
          border: "1px solid var(--border)",
          borderRadius: 8,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
            {t(locale, "faq.chat.empty")} <em>&quot;{t(locale, "faq.chat.example")}&quot;</em>
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
                maxWidth: "100%",
                padding: "0.35rem 0.6rem",
                borderRadius: 8,
                background: m.role === "user" ? "var(--brand)" : "var(--card-bg)",
                color: m.role === "user" ? "var(--on-brand)" : "var(--fg)",
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
            {m.role === "assistant" && m.sources && m.sources.length > 0 && (
              <div style={{ marginTop: "0.35rem", color: "var(--muted)", fontSize: "0.8rem" }}>
                {t(locale, "faq.chat.sourcesLabel")}:{" "}
                {m.sources.map((slug, i) => (
                  <span key={`${slug}-${i}`}>
                    <Link
                      href={withLocale(locale, `/docs/${sourceToDocSlug(slug)}`)}
                      className="kb-text-link"
                    >
                      {sourceToDocSlug(slug)}
                    </Link>
                    {i < m.sources!.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p className="kb-message-danger" style={{ marginBottom: "0.5rem" }}>
          {error}
        </p>
      )}
      <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>
        {t(locale, "faq.chat.followUpHint")}
      </p>
    </section>
  );
}
