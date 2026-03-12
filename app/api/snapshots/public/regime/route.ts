import { NextResponse } from "next/server";
import { getPublicRegimeSnapshot } from "@/lib/read-snapshots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/regime — Tier 1. */
export async function GET() {
  const data = getPublicRegimeSnapshot();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
