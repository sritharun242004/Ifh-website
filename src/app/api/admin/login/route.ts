import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, passwordOk } from "@/landing/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const token = adminToken();
  if (!token) return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  if (typeof body.password !== "string" || !passwordOk(body.password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
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
