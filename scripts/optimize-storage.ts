/**
 * Compresses every image already uploaded to the `photos` bucket's
 * site/ folder (admin uploads) in place: max 1600px, ~80% quality.
 *
 * Usage: npx tsx scripts/optimize-storage.ts
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

async function main() {
  const { data: files, error } = await supabase.storage
    .from("photos")
    .list("site", { limit: 1000 });
  if (error) throw error;

  for (const file of files ?? []) {
    const path = `site/${file.name}`;
    const { data: blob, error: dlErr } = await supabase.storage
      .from("photos")
      .download(path);
    if (dlErr || !blob) {
      console.error(`download failed: ${path}`);
      continue;
    }
    const before = blob.size;
    if (before < 300 * 1024) {
      console.log(`${path}: ${(before / 1024).toFixed(0)}KB — already small`);
      continue;
    }

    const input = Buffer.from(await blob.arrayBuffer());
    const out = await sharp(input)
      .rotate()
      .resize(2200, 2200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    const { error: upErr } = await supabase.storage
      .from("photos")
      .upload(path, out, { contentType: "image/jpeg", upsert: true });
    console.log(
      `${path}: ${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB${upErr ? ` (upload failed: ${upErr.message})` : ""}`
    );
  }
  console.log("Done.");
}

main();
