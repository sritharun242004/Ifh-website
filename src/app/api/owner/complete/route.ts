import { NextResponse } from "next/server";
import { completeLead, markWhatsAppSent } from "@/landing/lib/leads";
import { hasErrors, validateStep2 } from "@/landing/lib/validate";
import { sendSignupConfirmation } from "@/landing/lib/whatsapp";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Step 2 of the owner form: complete the lead, assign the seat, send the WhatsApp confirmation. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const leadId = typeof body.leadId === "string" && UUID.test(body.leadId) ? body.leadId : null;
  if (!leadId) return NextResponse.json({ error: "unknown_lead" }, { status: 404 });

  const { data, errors } = validateStep2(body);
  if (hasErrors(errors)) return NextResponse.json({ errors }, { status: 422 });
  const eventId = typeof body.eventId === "string" ? body.eventId.slice(0, 64) : null;

  try {
    // Photos: uploading is not wired yet (storage not chosen), so no URLs are stored; photo_count records intent.
    const done = await completeLead(leadId, data, [], eventId);
    if (!done) return NextResponse.json({ error: "unknown_lead" }, { status: 404 });

    // Send once: not again when the same number completes a second time.
    if (data.waConsent && !done.alreadyCompleted) {
      const sent = await sendSignupConfirmation(done.phone, done.name, done.position);
      if (sent) await markWhatsAppSent(leadId).catch(() => {});
    }
    return NextResponse.json({ position: done.position });
  } catch (err) {
    console.error("[owner/complete] failed", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
