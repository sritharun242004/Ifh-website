import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/landing/lib/admin-auth";
import { listLeads, setLeadStatus, LEAD_STATUSES, type LeadStatus } from "@/landing/lib/leads";

export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  const token = adminToken();
  return !!token && req.cookies.get(ADMIN_COOKIE)?.value === token;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const leads = await listLeads();
    return NextResponse.json({ leads }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin/leads] list failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: { token?: unknown; status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (
    typeof body.token !== "string" ||
    typeof body.status !== "string" ||
    !LEAD_STATUSES.includes(body.status as LeadStatus)
  ) {
    return NextResponse.json({ error: "Invalid token or status" }, { status: 422 });
  }
  try {
    const ok = await setLeadStatus(body.token, body.status as LeadStatus);
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "not_found" }, { status: 404 });
  } catch (err) {
    console.error("[admin/leads] update failed", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
