"use client";

/**
 * Downscales an image in the browser before upload: max 2200px on the
 * long edge, encoded as WebP at 92% quality (keeps transparency).
 * Big enough for full-bleed banners on large screens, small enough to
 * never trip the image optimizer's download timeout.
 * Falls back to the original file if anything goes wrong.
 */
export async function compressImage(
  file: File,
  maxEdge = 2200
): Promise<{ blob: Blob; ext: string; contentType: string }> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas context");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.92)
    );
    if (!blob) throw new Error("encode failed");

    // Only use the compressed version if it's actually smaller.
    if (blob.size < file.size) {
      return { blob, ext: "webp", contentType: "image/webp" };
    }
  } catch {
    // fall through to original
  }
  return {
    blob: file,
    ext: file.name.split(".").pop() || "jpg",
    contentType: file.type || "image/jpeg",
  };
}
