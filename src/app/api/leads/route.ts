import { NextResponse } from "next/server";
import { saveLead, validateLead } from "@/lib/leads";
import type { LeadKind } from "@/content/forms";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const kind = body.kind;
  if (kind !== "tenant" && kind !== "owner") {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }
  // Honeypot: real users never fill this hidden field. Pretend success so bots move on.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const result = validateLead(kind as LeadKind, body);
  if (!result.ok) return NextResponse.json({ errors: result.errors }, { status: 422 });

  try {
    await saveLead(kind as LeadKind, result.data);
  } catch (err) {
    console.error("saveLead failed", err);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
