import { NextResponse } from "next/server";
import { getPublicStrategySnapshotCached } from "@/lib/read-snapshots-cached";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/strategy — Tier 1. */
export async function GET() {
  const data = await getPublicStrategySnapshotCached();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
