import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, credsOk } from "@/landing/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const token = adminToken();
  if (!token) return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  const email = typeof body.email === "string" ? body.email : "";
  if (typeof body.password !== "string" || !credsOk(email, body.password)) {
    return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
