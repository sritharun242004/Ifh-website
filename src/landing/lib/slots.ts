import fs from "node:fs";
import path from "node:path";

const EXTS = ["webp", "avif", "jpg", "jpeg", "png"];

/** Server only. Find /public/landing/<slot>.<ext>; resolved at build time so final images drop in by name. */
export function findSlotImage(slot: string): string | null {
  for (const ext of EXTS) {
    const file = path.join(process.cwd(), "public", "landing", `${slot}.${ext}`);
    if (fs.existsSync(file)) return `/landing/${slot}.${ext}`;
  }
  return null;
}
