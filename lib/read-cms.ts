/**
 * CMS-light: read content from repo (content/cms.json, content/production_notes.json).
 * No placeholders — empty array means no notes.
 */

import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ProductionNoteRow {
  date: string;
  text: string;
}

export interface CmsData {
  production_notes: ProductionNoteRow[];
  notices: string[];
  compliance_override: string | null;
}

function readJsonFile<T>(filename: string): T | null {
  const fullPath = path.join(CONTENT_DIR, filename);
  try {
    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Production notes from content/production_notes.json (array of { date, text }). */
export function getProductionNotes(): ProductionNoteRow[] {
  const data = readJsonFile<ProductionNoteRow[]>("production_notes.json");
  return Array.isArray(data) ? data : [];
}

/** Full CMS payload from content/cms.json. */
export function getCmsData(): CmsData | null {
  const data = readJsonFile<CmsData>("cms.json");
  if (data && typeof data === "object" && Array.isArray(data.production_notes)) {
    return {
      production_notes: data.production_notes,
      notices: Array.isArray(data.notices) ? data.notices : [],
      compliance_override: data.compliance_override ?? null,
    };
  }
  return null;
}
