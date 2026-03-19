"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale";
import type { Tier2RequestRow } from "@/lib/tier2-requests";

interface Props {
  initialRequests: Tier2RequestRow[];
}

export function Tier2RequestsAdmin({ initialRequests }: Props) {
  const locale = useLocale();
  const [rows, setRows] = useState<Tier2RequestRow[]>(initialRequests);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ui = {
    nl: {
      title: "Tier 2-aanvragen",
      intro:
        "Aanvragen worden bewaard in data/tier2_requests.json. Via deze lijst kun je ze markeren als goedgekeurd; optioneel wordt een e-mail/webhook getriggerd.",
      pendingTitle: "Openstaande aanvragen",
      emptyPending: "Geen openstaande aanvragen.",
      approveButton: "Goedkeuren + mail",
      approving: "Bezig…",
      handledTitle: "Afgehandeld",
      statusLabel: "status",
      statusPending: "in behandeling",
      statusApproved: "goedgekeurd",
      errorApprove: "Kon aanvraag niet goedkeuren.",
      errorNetwork: "Netwerkfout bij goedkeuren.",
    },
    en: {
      title: "Tier 2 requests",
      intro:
        "Requests are stored in data/tier2_requests.json. From this list you can mark them as approved; optionally an email/webhook is triggered.",
      pendingTitle: "Pending requests",
      emptyPending: "No pending requests.",
      approveButton: "Approve + email",
      approving: "Sending…",
      handledTitle: "Handled",
      statusLabel: "status",
      statusPending: "pending",
      statusApproved: "approved",
      errorApprove: "Could not approve request.",
      errorNetwork: "Network error while approving.",
    },
    de: {
      title: "Tier 2-Anfragen",
      intro:
        "Anfragen werden in data/tier2_requests.json gespeichert. Über diese Liste kannst du sie als genehmigt markieren; optional wird eine E-Mail/Webhook ausgelöst.",
      pendingTitle: "Offene Anfragen",
      emptyPending: "Keine offenen Anfragen.",
      approveButton: "Genehmigen + Mail",
      approving: "Wird gesendet…",
      handledTitle: "Bearbeitet",
      statusLabel: "Status",
      statusPending: "ausstehend",
      statusApproved: "genehmigt",
      errorApprove: "Anfrage konnte nicht genehmigt werden.",
      errorNetwork: "Netzwerkfehler beim Genehmigen.",
    },
    fr: {
      title: "Demandes Tier 2",
      intro:
        "Les demandes sont stockées dans data/tier2_requests.json. Depuis cette liste, tu peux les marquer comme approuvées ; optionnellement un e-mail/webhook est déclenché.",
      pendingTitle: "Demandes en attente",
      emptyPending: "Aucune demande en attente.",
      approveButton: "Approuver + email",
      approving: "Envoi…",
      handledTitle: "Traitée(s)",
      statusLabel: "statut",
      statusPending: "en attente",
      statusApproved: "approuvé",
      errorApprove: "Impossible d'approuver la demande.",
      errorNetwork: "Erreur réseau lors de l'approbation.",
    },
  }[locale];

  function translateStatus(status: string): string {
    if (status === "pending") return ui.statusPending;
    if (status === "approved") return ui.statusApproved;
    return status;
  }

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
        // Server error messages may not be localized; keep a safe, localized UX message.
        setError(ui.errorApprove);
        return;
      }
      setRows((prev) =>
        prev.map((r) => (r.email === email && r.status === "pending" ? { ...r, status: "approved" } : r))
      );
    } catch {
      setError(ui.errorNetwork);
    } finally {
      setBusyEmail(null);
    }
  };

  const pending = rows.filter((r) => r.status === "pending");
  const nonPending = rows.filter((r) => r.status !== "pending");

  return (
    <section className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ fontSize: "1.1rem", margin: 0 }}>{ui.title}</h2>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
        {ui.intro.split("data/tier2_requests.json")[0]}
        <code>data/tier2_requests.json</code>
        {ui.intro.split("data/tier2_requests.json")[1] ?? ""}
      </p>
      {error && (
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--freshness-stale)" }}>
          {error}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1rem", margin: 0 }}>{ui.pendingTitle}</h3>
        {pending.length === 0 ? (
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>{ui.emptyPending}</p>
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
                    {ui.statusLabel}: {translateStatus(r.status)}
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
                    {busyEmail === r.email ? ui.approving : ui.approveButton}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {nonPending.length > 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          <h3 style={{ fontSize: "1rem", margin: 0 }}>{ui.handledTitle}</h3>
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
                {r.email} · {translateStatus(r.status)} · {new Date(r.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

