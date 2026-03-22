import { NextResponse } from "next/server";
import { getPublicMarketSnapshotCached } from "@/lib/read-snapshots-cached";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/market — Tier 1. */
export async function GET() {
  const data = await getPublicMarketSnapshotCached();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
