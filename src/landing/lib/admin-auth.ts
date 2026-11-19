import { createHash } from "node:crypto";

/** Cookie that holds the admin session token. */
export const ADMIN_COOKIE = "ifh_admin";

/** Opaque session token derived from ADMIN_PASSWORD — never the password itself.
 *  Returns null when ADMIN_PASSWORD is unset, which disables the admin entirely. */
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`ifh-admin::${pw}`).digest("hex");
}

export function passwordOk(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && input === pw;
}
