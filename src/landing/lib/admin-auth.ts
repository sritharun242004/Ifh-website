import { createHash } from "node:crypto";

/** Cookie that holds the admin session token. */
export const ADMIN_COOKIE = "ifh_admin";

/** Opaque session token derived from the admin credentials — never the raw
 *  password. Returns null when the admin isn't configured (no ADMIN_PASSWORD),
 *  which disables the admin entirely. */
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  const email = process.env.ADMIN_EMAIL ?? "";
  return createHash("sha256").update(`ifh-admin::${email}::${pw}`).digest("hex");
}

/** True when the supplied email + password match the configured admin.
 *  ADMIN_EMAIL is optional — when unset, only the password is checked. */
export function credsOk(email: string, password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || password !== pw) return false;
  const want = process.env.ADMIN_EMAIL;
  if (!want) return true;
  return email.trim().toLowerCase() === want.trim().toLowerCase();
}
