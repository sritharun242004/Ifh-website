export type StatusId = "new" | "contacted" | "converted" | "lost";

export const STATUSES: { id: StatusId; label: string; color: string; soft: string }[] = [
  { id: "new", label: "New lead", color: "#2563eb", soft: "#e8f0fe" },
  { id: "contacted", label: "Contacted", color: "#d97706", soft: "#fdf1e3" },
  { id: "converted", label: "Converted", color: "#16a34a", soft: "#e7f6ec" },
  { id: "lost", label: "Lost", color: "#dc2626", soft: "#fdecec" },
];

export const statusMeta = (id: StatusId) => STATUSES.find((s) => s.id === id) ?? STATUSES[0];

export type Lead = {
  token: string;
  name: string;
  phone: string;
  town: string;
  locationText: string | null;
  lat: number | null;
  lng: number | null;
  availability: string | null;
  photoUrls: string[];
  photoCount: number;
  waConsent: boolean;
  utm: Record<string, string>;
  fbclid: string | null;
  position: number | null;
  status: StatusId;
  completed: boolean;
  createdAt: string;
};

// Stored phone is 10 digits; present it as an Indian number.
export const intl = (p: string) => (p.length === 10 ? `91${p}` : p);
export const pretty = (p: string) => (p.length === 10 ? `+91 ${p.slice(0, 5)} ${p.slice(5)}` : `+${p}`);
export const fmtDate = (s: string) =>
  new Date(s).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
