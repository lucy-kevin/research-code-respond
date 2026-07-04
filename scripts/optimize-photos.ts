/**
 * Shrinks every headshot in public/fellows to web size (max 900px,
 * ~80% quality), overwrites the local file, and re-uploads it to
 * Supabase storage at the same path so existing photo URLs keep working.
 *
 * Usage: npx tsx scripts/optimize-photos.ts
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = url && serviceKey ? createClient(url, serviceKey) : null;

const DIR = join("public", "fellows");
const MAX = 900;

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function main() {
  const files = readdirSync(DIR).filter((f) => MIME[extname(f).toLowerCase()]);

  for (const file of files) {
    const path = join(DIR, file);
    const before = statSync(path).size;
    const ext = extname(file).toLowerCase();

    let pipeline = sharp(readFileSync(path)).rotate().resize(MAX, MAX, {
      fit: "inside",
      withoutEnlargement: true,
    });
    if (ext === ".png") pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    else if (ext === ".webp") pipeline = pipeline.webp({ quality: 80 });
    else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });

    const out = await pipeline.toBuffer();

    // Only overwrite when it actually helps.
    if (out.length < before) {
      writeFileSync(path, out);
    }

    let uploaded = "";
    if (supabase) {
      const { error } = await supabase.storage
        .from("photos")
        .upload(`fellows/${file}`, readFileSync(path), {
          contentType: MIME[ext],
          upsert: true,
        });
      uploaded = error ? `  (upload failed: ${error.message})` : "  ↑ uploaded";
    }

    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB → ${(statSync(path).size / 1024).toFixed(0)}KB${uploaded}`
    );
  }
  console.log("\nDone.");
}

main();
