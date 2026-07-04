/**
 * One-time seed: pushes src/data/fellows.ts and the photos in
 * public/fellows/ into Supabase.
 *
 * Usage:
 *   1. Fill in .env.local (needs SUPABASE_SERVICE_ROLE_KEY).
 *   2. npx tsx scripts/seed.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { FELLOWS } from "../src/data/fellows";

process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

async function main() {
  const { count } = await supabase
    .from("fellows")
    .select("*", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(
      `The fellows table already has ${count} rows — aborting so nothing is duplicated.`
    );
    process.exit(1);
  }

  for (const [i, fellow] of FELLOWS.entries()) {
    let photo_url: string | null = null;

    if (fellow.photo) {
      const local = join("public", fellow.photo);
      if (existsSync(local)) {
        const ext = fellow.photo.split(".").pop()!.toLowerCase();
        const storagePath = fellow.photo.replace(/^\//, ""); // fellows/name.jpg
        const { error: upErr } = await supabase.storage
          .from("photos")
          .upload(storagePath, readFileSync(local), {
            contentType: MIME[ext] ?? "image/jpeg",
            upsert: true,
          });
        if (upErr) {
          console.error(`  photo failed for ${fellow.name}:`, upErr.message);
        } else {
          photo_url = supabase.storage
            .from("photos")
            .getPublicUrl(storagePath).data.publicUrl;
        }
      }
    }

    const { error } = await supabase.from("fellows").insert({
      name: fellow.name,
      country: fellow.country,
      code: fellow.code,
      track: fellow.track,
      profession: fellow.profession,
      bio: fellow.bio,
      why: fellow.why,
      hope: fellow.hope,
      photo_url,
      featured: fellow.featured ?? false,
      sort_order: i,
    });
    if (error) {
      console.error(`  insert failed for ${fellow.name}:`, error.message);
    } else {
      console.log(`✓ ${fellow.name}${photo_url ? " (with photo)" : ""}`);
    }
  }

  console.log("\nSeed complete.");
}

main();
