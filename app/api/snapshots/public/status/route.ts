import { NextResponse } from "next/server";
import { getPublicStatusSnapshot } from "@/lib/read-snapshots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/status — Tier 1. */
export async function GET() {
  const data = getPublicStatusSnapshot();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
