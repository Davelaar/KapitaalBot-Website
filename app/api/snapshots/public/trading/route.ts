import { NextResponse } from "next/server";
import { getPublicTradingSnapshot } from "@/lib/read-snapshots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/snapshots/public/trading — Tier 1. */
export async function GET() {
  const data = getPublicTradingSnapshot();
  if (!data) {
    return NextResponse.json(
      { error: "Snapshot not available" },
      { status: 503 }
    );
  }
  return NextResponse.json(data);
}
