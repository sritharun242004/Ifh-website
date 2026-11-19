/* Client-side photo compression: longest side ≤ 1600px, target ≤ ~300KB, WebP (JPEG fallback). */

const MAX_SIDE = 1600;
const TARGET_BYTES = 300 * 1024;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* fall through (e.g. HEIC on some browsers) */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function compressImage(file: File): Promise<Blob> {
  const src = await decode(file);
  const w = "naturalWidth" in src ? src.naturalWidth : src.width;
  const h = "naturalHeight" in src ? src.naturalHeight : src.height;
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")!.drawImage(src, 0, 0, canvas.width, canvas.height);
  if ("close" in src) src.close();

  const probe = await toBlob(canvas, "image/webp", 0.8);
  const type = probe && probe.type === "image/webp" ? "image/webp" : "image/jpeg";
  let best = probe && probe.type === type ? probe : await toBlob(canvas, type, 0.8);
  for (let q = 0.7; best && best.size > TARGET_BYTES && q >= 0.4; q -= 0.1) {
    best = await toBlob(canvas, type, q);
  }
  if (!best) throw new Error("compress_failed");
  return best;
}
