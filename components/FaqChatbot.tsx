"use client";

import { useState } from "react";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export function FaqChatbot() {
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
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>FAQ chatbot (preview)</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
        Stel een vraag over KapitaalBot, de engine of de observability-website. Deze chatbot gebruikt
        een kleine knowledge base; in een volgende fase wordt dit een volledige RAG over de SSOT-docs.
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
            Nog geen berichten. Stel een vraag, bijvoorbeeld:{" "}
            <em>"Wat is het verschil tussen Tier 1 en Tier 2?"</em>
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
          placeholder="Stel een vraag over KapitaalBot..."
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
          {loading ? "Bezig..." : "Stuur"}
        </button>
      </form>
    </section>
  );
}

