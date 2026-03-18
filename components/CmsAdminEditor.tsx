"use client";

import { useMemo, useState } from "react";
import type { ProductionNoteRow } from "@/lib/read-cms";

export interface CmsAdminEditorProps {
  initialNotices: string[];
  initialComplianceOverride: string | null;
  initialProductionNotes: ProductionNoteRow[];
}

function clampText(s: string, maxLen: number): string {
  const t = s.trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen);
}

export default function CmsAdminEditor({
  initialNotices,
  initialComplianceOverride,
  initialProductionNotes,
}: CmsAdminEditorProps) {
  const [notices, setNotices] = useState<string[]>(initialNotices);
  const [complianceOverride, setComplianceOverride] = useState<string>(
    initialComplianceOverride ?? "",
  );
  const [productionNotes, setProductionNotes] = useState<ProductionNoteRow[]>(initialProductionNotes);
  const [commitMessage, setCommitMessage] = useState<string>("Update CMS-light content");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const normalizedPreview = useMemo(() => {
    return {
      cms: {
        production_notes: productionNotes,
        notices: notices.map((n) => clampText(n, 500)).filter(Boolean),
        compliance_override: complianceOverride.trim() ? clampText(complianceOverride, 800) : null,
      },
      production_notes: productionNotes,
    };
  }, [complianceOverride, notices, productionNotes]);

  async function handleSave() {
    setError(null);
    setSuccess(null);
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        commitMessage: clampText(commitMessage, 120) || "Update CMS-light content",
        notices: notices.map((n) => clampText(n, 500)).filter(Boolean),
        compliance_override: complianceOverride.trim() ? clampText(complianceOverride, 800) : null,
        production_notes: productionNotes.map((row) => ({
          date: clampText(row.date, 64),
          text: clampText(row.text, 3000),
        })).filter((row) => row.date && row.text),
      };

      const res = await fetch("/api/cms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to save CMS content.");
        return;
      }

      setSuccess(data.message ?? "Saved and pushed.");
    } catch (e: any) {
      setError(e?.message ?? "Failed to save CMS content.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ padding: "1.25rem 1.25rem", marginTop: "1rem" }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>CMS-light admin</h2>

      {error && (
        <p style={{ margin: "0 0 0.75rem", color: "#f97373" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ margin: "0 0 0.75rem", color: "var(--freshness-good)" }}>
          {success}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}>
            Compliance override (bijv. disclaimer)
          </label>
          <textarea
            value={complianceOverride}
            onChange={(e) => setComplianceOverride(e.target.value)}
            rows={6}
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

        <div>
          <label style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}>
            Commit message
          </label>
          <input
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
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

          <div style={{ marginTop: "0.75rem" }}>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                background: "var(--accent)",
                color: "#0f1419",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: saving ? "default" : "pointer",
                opacity: saving ? 0.85 : 1,
              }}
            >
              {saving ? "Saving..." : "Save (commit + push)"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>Homepage notices</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {notices.map((n, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <textarea
                  value={n}
                  onChange={(e) => {
                    const next = [...notices];
                    next[i] = e.target.value;
                    setNotices(next);
                  }}
                  rows={3}
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.75rem",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--fg)",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setNotices((prev) => prev.filter((_, idx) => idx !== i))}
                  style={{
                    padding: "0.35rem 0.65rem",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    height: 32,
                    marginTop: 4,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setNotices((prev) => [...prev, ""])}
              style={{
                padding: "0.45rem 0.75rem",
                background: "transparent",
                color: "var(--fg)",
                border: "1px dashed var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              + Add notice
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>Production notes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {productionNotes.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", gap: "0.5rem", alignItems: "start" }}>
                <input
                  value={row.date}
                  onChange={(e) => {
                    const next = [...productionNotes];
                    next[i] = { ...next[i], date: e.target.value };
                    setProductionNotes(next);
                  }}
                  placeholder="YYYY-MM-DD"
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
                <textarea
                  value={row.text}
                  onChange={(e) => {
                    const next = [...productionNotes];
                    next[i] = { ...next[i], text: e.target.value };
                    setProductionNotes(next);
                  }}
                  rows={3}
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
                <button
                  type="button"
                  onClick={() => setProductionNotes((prev) => prev.filter((_, idx) => idx !== i))}
                  style={{
                    padding: "0.35rem 0.65rem",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    height: 32,
                    marginTop: 4,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProductionNotes((prev) => [...prev, { date: new Date().toISOString().slice(0, 10), text: "" }])}
              style={{
                padding: "0.45rem 0.75rem",
                background: "transparent",
                color: "var(--fg)",
                border: "1px dashed var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              + Add production note
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>Preview (normalized)</h3>
        <pre style={{ margin: 0, maxHeight: 280, overflow: "auto", fontSize: "0.75rem", color: "var(--muted)" }}>
          {JSON.stringify(normalizedPreview, null, 2)}
        </pre>
      </div>
    </div>
  );
}

