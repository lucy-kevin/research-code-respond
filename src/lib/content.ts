import { createClient } from "@supabase/supabase-js";
import { FELLOWS as LOCAL_FELLOWS, type Fellow } from "@/data/fellows";

interface FellowRow {
  name: string;
  country: string;
  code: string;
  track: string;
  profession: string;
  bio: string;
  why: string;
  hope: string;
  photo_url: string | null;
  featured: boolean;
}

/**
 * Fetch fellows from Supabase when configured; otherwise (or on any
 * failure) fall back to the local snapshot in src/data/fellows.ts so
 * the site keeps working before the backend exists.
 */
export async function getFellows(): Promise<Fellow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return LOCAL_FELLOWS;

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("fellows")
      .select(
        "name, country, code, track, profession, bio, why, hope, photo_url, featured"
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) return LOCAL_FELLOWS;

    return (data as FellowRow[]).map((r) => ({
      name: r.name,
      country: r.country,
      code: r.code,
      track: r.track,
      profession: r.profession,
      bio: r.bio,
      why: r.why,
      hope: r.hope,
      photo: r.photo_url ?? undefined,
      featured: r.featured || undefined,
    }));
  } catch {
    return LOCAL_FELLOWS;
  }
}

