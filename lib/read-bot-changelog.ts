import fs from "fs";
import path from "path";

export interface BotChangelogEntry {
  hash: string;
  short: string;
  committed_at: string;
  subject: string;
  body: string | null;
  summary: { nl: string; en: string; de: string; fr: string };
}

export interface BotChangelogFile {
  source_repo: string;
  generated_at: string;
  commit_count: number;
  entries: BotChangelogEntry[];
}

export function readBotChangelog(): BotChangelogFile | null {
  const p = path.join(process.cwd(), "content", "bot_changelog.json");
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as BotChangelogFile;
  } catch {
    return null;
  }
}
