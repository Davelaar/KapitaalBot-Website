"use client";

import { useState } from "react";
import type { Tier2RequestRow } from "@/lib/tier2-requests";

interface Props {
  initialRequests: Tier2RequestRow[];
}

export function Tier2RequestsAdmin({ initialRequests }: Props) {
  const [rows, setRows] = useState<Tier2RequestRow[]>(initialRequests);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (email: string) => {
    setError(null);
    setBusyEmail(email);
    try {
      const res = await fetch("/api/tier2-request/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Kon aanvraag niet goedkeuren.");
        return;
      }
      setRows((prev) =>
        prev.map((r) => (r.email === email && r.status === "pending" ? { ...r, status: "approved" } : r))
      );
    } catch {
      setError("Netwerkfout bij goedkeuren.");
    } finally {
      setBusyEmail(null);
    }
  };

  const pending = rows.filter((r) => r.status === "pending");
  const nonPending = rows.filter((r) => r.status !== "pending");

  return (
    <section className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Tier 2-aanvragen</h2>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
        Aanvragen worden bewaard in <code>data/tier2_requests.json</code>. Via deze lijst kun je ze markeren als
        goedgekeurd; optioneel wordt een e-mail/webhook getriggerd.
      </p>
      {error && (
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--freshness-stale)" }}>
          {error}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1rem", margin: 0 }}>Openstaande aanvragen</h3>
        {pending.length === 0 ? (
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>Geen openstaande aanvragen.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pending.map((r) => (
              <li
                key={`${r.email}-${r.created_at}`}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.75rem 0.85rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600 }}>{r.email}</span>
                  <span style={{ color: "var(--muted)" }}>
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: 0, color: "var(--muted)" }}>{r.reason}</p>
                <div style={{ marginTop: "0.35rem", display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: 999,
                      background: "var(--badge-bg, rgba(255,255,255,0.05))",
                      border: "1px solid var(--border)",
                    }}
                  >
                    status: {r.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApprove(r.email)}
                    disabled={busyEmail === r.email}
                    style={{
                      padding: "0.25rem 0.9rem",
                      borderRadius: 999,
                      border: "none",
                      background: "var(--accent)",
                      color: "#0f1419",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: busyEmail === r.email ? "not-allowed" : "pointer",
                    }}
                  >
                    {busyEmail === r.email ? "Bezig…" : "Goedkeuren + mail"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {nonPending.length > 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          <h3 style={{ fontSize: "1rem", margin: 0 }}>Afgehandeld</h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0.5rem 0 0",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--muted)",
            }}
          >
            {nonPending.map((r) => (
              <li key={`${r.email}-${r.created_at}`}>
                {r.email} · {r.status} · {new Date(r.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

