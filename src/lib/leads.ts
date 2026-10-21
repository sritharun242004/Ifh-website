import { neon } from "@neondatabase/serverless";
import { FORMS, type LeadKind } from "@/content/forms";

export type LeadInput = Record<string, string | string[]>;

const TABLE: Record<LeadKind, string> = { tenant: "tenant_leads", owner: "owner_leads" };

/** Normalise an Indian mobile number to 10 digits, or return null if invalid. */
export function cleanMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/** Validate a submission against the form config. Returns clean values or a field → message map. */
export function validateLead(
  kind: LeadKind,
  body: Record<string, unknown>,
): { ok: true; data: LeadInput } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const data: LeadInput = {};

  for (const f of FORMS[kind].fields) {
    const raw = body[f.name];
    if (f.type === "chips") {
      const picked = Array.isArray(raw)
        ? raw.filter((v): v is string => typeof v === "string")
        : [];
      const valid = picked.filter((v) => f.options.includes(v));
      if (f.required && valid.length === 0) errors[f.name] = "Choose at least one";
      data[f.name] = valid;
      continue;
    }
    const value =
      typeof raw === "string" ? raw.trim().slice(0, f.type === "textarea" ? 1000 : 200) : "";
    if (!value) {
      if (f.required) errors[f.name] = "This field is required";
      data[f.name] = "";
      continue;
    }
    if (f.name === "mobile") {
      const m = cleanMobile(value);
      if (!m) errors.mobile = "Enter a valid 10-digit mobile number";
      else data.mobile = m;
    } else if (f.type === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[f.name] = "Enter a valid email";
      else data[f.name] = value;
    } else if (f.type === "select" || f.type === "radio") {
      if (!f.options.includes(value)) errors[f.name] = "Choose one of the options";
      else data[f.name] = value;
    } else {
      data[f.name] = value;
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

const READY = new Set<string>();

/** Store the answers as JSONB next to the contact columns, so the questionnaire can evolve without migrations. */
export async function saveLead(kind: LeadKind, data: LeadInput) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  const table = TABLE[kind];

  if (!READY.has(table)) {
    await sql.query(
      `CREATE TABLE IF NOT EXISTS ${table} (
         id BIGSERIAL PRIMARY KEY,
         created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
         name TEXT NOT NULL,
         mobile TEXT NOT NULL,
         email TEXT,
         city TEXT NOT NULL,
         answers JSONB NOT NULL
       )`,
    );
    READY.add(table);
  }
  const { name, mobile, email, city, ...answers } = data;
  await sql.query(
    `INSERT INTO ${table} (name, mobile, email, city, answers) VALUES ($1, $2, $3, $4, $5)`,
    [name, mobile, email || null, city, JSON.stringify(answers)],
  );
}
