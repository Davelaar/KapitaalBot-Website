import { NextResponse } from "next/server";
import { getPublicRegimeSnapshotCached } from "@/lib/read-snapshots-cached";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/regime — Tier 1. */
export async function GET() {
  const data = await getPublicRegimeSnapshotCached();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
