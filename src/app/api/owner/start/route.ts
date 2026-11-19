import { NextResponse } from "next/server";
import { savePartialLead } from "@/landing/lib/leads";
import { hasErrors, validateStep1 } from "@/landing/lib/validate";

export const dynamic = "force-dynamic";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];

/** Step 1 of the owner form: save the partial lead immediately. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // Honeypot: real users never fill this hidden field.
  if (typeof body.website === "string" && body.website) {
    return NextResponse.json({ leadId: crypto.randomUUID() });
  }

  const { data, errors } = validateStep1(body);
  if (hasErrors(errors)) return NextResponse.json({ errors }, { status: 422 });

  const rawUtm = (body.utm ?? {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) if (typeof rawUtm[k] === "string") utm[k] = (rawUtm[k] as string).slice(0, 200);
  const fbclid = typeof body.fbclid === "string" ? body.fbclid.slice(0, 500) : null;

  try {
    const { leadId } = await savePartialLead(data, { utm, fbclid });
    return NextResponse.json({ leadId });
  } catch (err) {
    console.error("[owner/start] failed", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
