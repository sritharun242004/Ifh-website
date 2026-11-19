/* Meta Pixel helpers (client). The base code (with PageView) is injected by <MetaPixel/> only
   when NEXT_PUBLIC_META_PIXEL_ID is set; without it every call here is a silent no-op. */

type Fbq = (...args: unknown[]) => void;
const fbq = (): Fbq | null =>
  typeof window !== "undefined" && typeof (window as unknown as { fbq?: Fbq }).fbq === "function"
    ? (window as unknown as { fbq: Fbq }).fbq
    : null;

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/** Standard event. Pass `eventId` for events that will be de-duplicated with the Conversions API. */
export function track(event: string, params?: Record<string, unknown>, eventId?: string) {
  fbq()?.("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  fbq()?.("trackCustom", event, params ?? {});
}

export function newEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
