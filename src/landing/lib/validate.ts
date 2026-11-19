import { config } from "@/landing/config";
import { copy } from "@/landing/copy";

/* Shared by the form (instant feedback) and the API routes (source of truth). */

export type Step1 = { name: string; phone: string; town: string };
export type Availability = (typeof copy.form.when.options)[number];
export type Step2 = {
  locationText: string;
  lat: number | null;
  lng: number | null;
  availability: Availability | "";
  waConsent: boolean;
  photoCount: number;
};
export type Errors<T> = Partial<Record<keyof T, string>>;

const E = copy.form.errors;

/** Indian mobile → 10 digits, accepting +91 / 0 prefixes and spaces. */
export function cleanPhone(raw: string) {
  return raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
}

export function validateStep1(input: Partial<Record<keyof Step1, unknown>>) {
  const name = String(input.name ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  const phone = cleanPhone(String(input.phone ?? ""));
  const town = String(input.town ?? "");
  const errors: Errors<Step1> = {};
  if (name.length < 2) errors.name = E.name;
  if (phone.length !== 10) errors.phone = E.phone;
  else if (!/^[6-9]/.test(phone)) errors.phone = E.phoneStart;
  if (!(config.towns as readonly string[]).includes(town)) errors.town = E.town;
  return { data: { name, phone, town } as Step1, errors };
}

const num = (v: unknown, min: number, max: number) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v !== "" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

export function validateStep2(input: Partial<Record<keyof Step2, unknown>>) {
  const locationText = String(input.locationText ?? "").trim().slice(0, 200);
  const lat = num(input.lat, -90, 90);
  const lng = num(input.lng, -180, 180);
  const availability = String(input.availability ?? "") as Step2["availability"];
  const errors: Errors<Step2> = {};
  if (!locationText && (lat === null || lng === null)) errors.locationText = E.location;
  if (!(copy.form.when.options as readonly string[]).includes(availability)) errors.availability = E.when;
  return {
    data: {
      locationText,
      lat,
      lng,
      availability,
      waConsent: input.waConsent === true,
      photoCount: Math.max(0, Math.min(10, Math.floor(Number(input.photoCount) || 0))),
    } as Step2,
    errors,
  };
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;
