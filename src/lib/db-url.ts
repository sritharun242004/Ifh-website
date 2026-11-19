/**
 * The @neondatabase/serverless driver (used by the data layer) cannot parse
 * Prisma-only connection params such as `connection_limit`, `pgbouncer` or
 * `pool_timeout`. Passing the Prisma-formatted DATABASE_URL straight to neon()
 * makes every query fail. Strip everything except `sslmode` so the single
 * DATABASE_URL the app uses works for both Prisma and the Neon serverless driver.
 */
export function cleanDbUrl(raw: string): string {
  try {
    const url = new URL(raw);
    const sslmode = url.searchParams.get("sslmode") ?? "require";
    url.search = new URLSearchParams({ sslmode }).toString();
    return url.toString();
  } catch {
    return raw;
  }
}
