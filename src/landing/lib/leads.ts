import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { cleanDbUrl } from "@/lib/db-url";
import { config } from "@/landing/config";
import type { Step1, Step2 } from "./validate";

/* Data layer for owner sign-ups (server only).
   Store: the project's existing Neon Postgres (DATABASE_URL), table `owner_signups`.
   - One row per phone number (UNIQUE). Signing up again updates the row; it never takes a second seat.
   - Step 1 saves a partial lead immediately. A seat is taken only when step 2 completes.
   - `position` is the order of completion; seats taken = completed rows.
   - The client only ever holds `token` (random UUID), never the numeric id.

   Local dev without DATABASE_URL: an in-memory store with the same rules, so the page can be
   exercised end to end. Disabled in production, where a missing DATABASE_URL is an error. */

export type Seats = { total: number; taken: number };
export type Tracking = { utm: Record<string, string>; fbclid: string | null };

const TABLE = "owner_signups";

function db() {
  const url = process.env.DATABASE_URL;
  return url ? neon(cleanDbUrl(url)) : null;
}
type Sql = NonNullable<ReturnType<typeof db>>;

function noDb(): never | void {
  if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is not set");
}

let ready = false;
async function ensureTable(sql: Sql) {
  if (ready) return;
  await sql.query(
    `CREATE TABLE IF NOT EXISTS ${TABLE} (
       id            BIGSERIAL PRIMARY KEY,
       token         UUID NOT NULL UNIQUE,
       created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
       name          TEXT NOT NULL,
       phone         TEXT NOT NULL UNIQUE,
       town          TEXT NOT NULL,
       location_text TEXT,
       lat           DOUBLE PRECISION,
       lng           DOUBLE PRECISION,
       availability  TEXT,
       photo_urls    JSONB NOT NULL DEFAULT '[]'::jsonb,
       photo_count   INTEGER NOT NULL DEFAULT 0,
       wa_consent    BOOLEAN NOT NULL DEFAULT false,
       wa_sent_at    TIMESTAMPTZ,
       utm           JSONB NOT NULL DEFAULT '{}'::jsonb,
       fbclid        TEXT,
       lead_event_id TEXT,
       completed_at  TIMESTAMPTZ,
       position      INTEGER UNIQUE,
       status        TEXT NOT NULL DEFAULT 'new'
     )`,
  );
  // Board stage column, added safely for any table that predates it.
  await sql.query(`ALTER TABLE ${TABLE} ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'`);
  ready = true;
}

/* ---------- dev-only memory store ---------- */
type MemLead = Step1 & Partial<Step2> & Tracking & { token: string; position: number | null };
const g = globalThis as unknown as { __ifhMemLeads?: Map<string, MemLead> };
const mem = (g.__ifhMemLeads ??= new Map<string, MemLead>()); // keyed by phone

/** Real seat count: completed sign-ups in the store. `total` comes from config. */
export async function getSeats(): Promise<Seats & { source: "db" | "memory" }> {
  const total = config.seatTotal;
  const sql = db();
  if (!sql) {
    noDb();
    return { total, taken: [...mem.values()].filter((l) => l.position !== null).length, source: "memory" };
  }
  await ensureTable(sql);
  const rows = (await sql.query(
    `SELECT count(*)::int AS taken FROM ${TABLE} WHERE completed_at IS NOT NULL`,
  )) as { taken: number }[];
  return { total, taken: rows[0]?.taken ?? 0, source: "db" };
}

/** Step 1: save (or refresh) the lead right away so it is kept even if the owner drops off. */
export async function savePartialLead(step1: Step1, tracking: Tracking): Promise<{ leadId: string }> {
  const sql = db();
  if (!sql) {
    noDb();
    const existing = mem.get(step1.phone);
    const lead: MemLead = existing
      ? existing.position !== null
        ? existing // completed: never modified from the public form
        : { ...existing, ...step1 }
      : { ...step1, ...tracking, token: randomUUID(), position: null };
    mem.set(step1.phone, lead);
    return { leadId: lead.token };
  }
  await ensureTable(sql);
  // Same phone = same lead. Phones are not verified (no OTP), so a COMPLETED sign-up is never
  // modified from the public form: re-submitting returns the same seat but changes nothing.
  // An unfinished (step-1 only) lead may be refreshed with the latest name/town.
  const rows = (await sql.query(
    `INSERT INTO ${TABLE} AS t (token, name, phone, town, utm, fbclid)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)
     ON CONFLICT (phone) DO UPDATE
       SET name = CASE WHEN t.completed_at IS NULL THEN EXCLUDED.name ELSE t.name END,
           town = CASE WHEN t.completed_at IS NULL THEN EXCLUDED.town ELSE t.town END,
           updated_at = CASE WHEN t.completed_at IS NULL THEN now() ELSE t.updated_at END
     RETURNING token`,
    [randomUUID(), step1.name, step1.phone, step1.town, JSON.stringify(tracking.utm), tracking.fbclid],
  )) as { token: string }[];
  return { leadId: rows[0].token };
}

export type Completed = { position: number; name: string; phone: string; alreadyCompleted: boolean };

/** Step 2: complete the lead and give it a seat number (once). Returns null for an unknown leadId. */
export async function completeLead(
  leadId: string,
  step2: Step2,
  photoUrls: string[],
  leadEventId: string | null,
): Promise<Completed | null> {
  const sql = db();
  if (!sql) {
    noDb();
    const lead = [...mem.values()].find((l) => l.token === leadId);
    if (!lead) return null;
    const alreadyCompleted = lead.position !== null;
    if (alreadyCompleted) return { position: lead.position!, name: lead.name, phone: lead.phone, alreadyCompleted };
    Object.assign(lead, step2);
    lead.position = [...mem.values()].filter((l) => l.position !== null).length + 1;
    return { position: lead.position!, name: lead.name, phone: lead.phone, alreadyCompleted };
  }
  await ensureTable(sql);
  const params = [
    leadId,
    step2.locationText || null,
    step2.lat,
    step2.lng,
    step2.availability,
    JSON.stringify(photoUrls),
    step2.photoCount,
    step2.waConsent,
    leadEventId,
  ];
  const update = `location_text = $2, lat = $3, lng = $4, availability = $5, photo_urls = $6::jsonb,
                  photo_count = $7, wa_consent = $8, lead_event_id = COALESCE(lead_event_id, $9), updated_at = now()`;

  // Two people finishing at the same instant can compute the same next position; the UNIQUE
  // constraint rejects one of them, which then simply retries with the next number.
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const rows = (await sql.query(
        `UPDATE ${TABLE}
            SET ${update},
                completed_at = now(),
                position = (SELECT COALESCE(MAX(position), 0) + 1 FROM ${TABLE})
          WHERE token = $1 AND completed_at IS NULL
          RETURNING position, name, phone`,
        params,
      )) as { position: number; name: string; phone: string }[];
      if (rows[0]) return { ...rows[0], alreadyCompleted: false };
      break;
    } catch (err) {
      if ((err as { code?: string }).code !== "23505" || attempt === 3) throw err;
    }
  }
  // Already completed earlier (same phone signed up again): read-only, return the same seat.
  const rows = (await sql.query(`SELECT position, name, phone FROM ${TABLE} WHERE token = $1`, [
    leadId,
  ])) as { position: number | null; name: string; phone: string }[];
  if (!rows[0] || rows[0].position === null) return null;
  return { position: rows[0].position, name: rows[0].name, phone: rows[0].phone, alreadyCompleted: true };
}

/** Mark that the WhatsApp confirmation went out (best effort). */
export async function markWhatsAppSent(leadId: string) {
  const sql = db();
  if (!sql) return;
  await sql.query(`UPDATE ${TABLE} SET wa_sent_at = now() WHERE token = $1`, [leadId]);
}

/* ---------- admin: lead board ---------- */
export type LeadStatus = "new" | "contacted" | "converted" | "lost";
export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "converted", "lost"];
export type AdminLead = {
  token: string;
  name: string;
  phone: string;
  town: string;
  locationText: string | null;
  availability: string | null;
  photoCount: number;
  status: LeadStatus;
  completed: boolean;
  createdAt: string;
};

/** Every sign-up for the admin board, newest first. */
export async function listLeads(): Promise<AdminLead[]> {
  const sql = db();
  if (!sql) {
    return [...mem.values()].map((l) => ({
      token: l.token, name: l.name, phone: l.phone, town: l.town,
      locationText: l.locationText ?? null, availability: l.availability ?? null,
      photoCount: l.photoCount ?? 0, status: ((l as { status?: LeadStatus }).status ?? "new"),
      completed: l.position !== null, createdAt: new Date().toISOString(),
    }));
  }
  await ensureTable(sql);
  const rows = (await sql.query(
    `SELECT token, name, phone, town, location_text, availability, photo_count,
            status, completed_at, created_at
       FROM ${TABLE}
      ORDER BY created_at DESC`,
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    token: String(r.token), name: String(r.name), phone: String(r.phone), town: String(r.town),
    locationText: (r.location_text as string | null) ?? null,
    availability: (r.availability as string | null) ?? null,
    photoCount: Number(r.photo_count ?? 0),
    status: (String(r.status || "new") as LeadStatus),
    completed: r.completed_at != null,
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

/** Move a lead to a different board column. Returns false if the token is unknown. */
export async function setLeadStatus(token: string, status: LeadStatus): Promise<boolean> {
  const sql = db();
  if (!sql) {
    const lead = [...mem.values()].find((l) => l.token === token);
    if (lead) (lead as { status?: LeadStatus }).status = status;
    return !!lead;
  }
  await ensureTable(sql);
  const rows = (await sql.query(
    `UPDATE ${TABLE} SET status = $2, updated_at = now() WHERE token = $1 RETURNING token`,
    [token, status],
  )) as unknown[];
  return rows.length > 0;
}
