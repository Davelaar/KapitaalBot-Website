import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import { getSessionTier } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CMS_FILE = path.join(CONTENT_DIR, "cms.json");
const PRODUCTION_NOTES_FILE = path.join(CONTENT_DIR, "production_notes.json");

function normalizeArrayStrings(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
}

function normalizeComplianceOverride(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const v = input.trim();
  return v ? v : null;
}

function normalizeProductionNotes(input: unknown): Array<{ date: string; text: string }> {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const anyRow = row as any;
      const date = typeof anyRow.date === "string" ? anyRow.date.trim() : "";
      const text = typeof anyRow.text === "string" ? anyRow.text.trim() : "";
      if (!date || !text) return null;
      return { date, text };
    })
    .filter((x): x is { date: string; text: string } => x != null);
}

export async function POST(req: NextRequest) {
  const tier = await getSessionTier();
  if (tier < 3) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const commitMessageRaw = typeof body?.commitMessage === "string" ? body.commitMessage : "";
  const commitMessage = (commitMessageRaw.trim() || "Update CMS-light content").slice(0, 120);

  const notices = normalizeArrayStrings(body?.notices).slice(0, 40);
  const compliance_override = normalizeComplianceOverride(body?.compliance_override);
  const production_notes = normalizeProductionNotes(body?.production_notes);

  try {
    // Write files first so git can commit exactly what the API received.
    if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });

    fs.writeFileSync(
      CMS_FILE,
      JSON.stringify(
        {
          production_notes,
          notices,
          compliance_override,
        },
        null,
        2,
      ),
      "utf-8",
    );

    fs.writeFileSync(
      PRODUCTION_NOTES_FILE,
      JSON.stringify(production_notes, null, 2),
      "utf-8",
    );

    execSync("git add \"content/cms.json\" \"content/production_notes.json\"", {
      cwd: process.cwd(),
      stdio: "ignore",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });

    // No-op guard: if nothing changed, avoid creating empty commits.
    let hasChanges = true;
    try {
      execSync("git diff --cached --quiet", { cwd: process.cwd(), stdio: "ignore" });
      hasChanges = false;
    } catch {
      hasChanges = true;
    }

    const message = hasChanges ? `Saved and committed: "${commitMessage}"` : "No changes detected.";
    if (!hasChanges) {
      return NextResponse.json({ ok: true, message, commitHash: execSync("git rev-parse HEAD", { cwd: process.cwd() }).toString().trim() });
    }

    execSync(`git commit -m ${JSON.stringify(commitMessage)}`, {
      cwd: process.cwd(),
      stdio: "ignore",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    execSync("git push", { cwd: process.cwd(), stdio: "ignore" });

    const commitHash = execSync("git rev-parse HEAD", { cwd: process.cwd() }).toString().trim();
    return NextResponse.json({ ok: true, message, commitHash });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e?.message ?? "Failed to save CMS content.",
      },
      { status: 500 },
    );
  }
}

