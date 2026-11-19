import { NextResponse } from "next/server";
import { getSeats } from "@/landing/lib/leads";

export const dynamic = "force-dynamic";

/** Live free-spot counter for the owner landing page. Never cached. */
export async function GET() {
  try {
    const { total, taken, source } = await getSeats();
    if (source === "memory") console.warn("[seats] DATABASE_URL not set: using dev memory store");
    return NextResponse.json(
      { total, taken, left: Math.max(0, total - taken) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[seats] failed", err);
    return NextResponse.json(
      { error: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
