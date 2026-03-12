import { NextResponse } from "next/server";
import { getPublicStrategySnapshot } from "@/lib/read-snapshots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/strategy — Tier 1. */
export async function GET() {
  const data = getPublicStrategySnapshot();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
