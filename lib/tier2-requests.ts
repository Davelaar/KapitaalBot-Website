import fs from "fs";
import path from "path";

export interface Tier2RequestRow {
  email: string;
  reason: string;
  created_at: string;
  status: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tier2_requests.json");

export function readTier2Requests(): Tier2RequestRow[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeTier2Requests(rows: Tier2RequestRow[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2), "utf-8");
}

