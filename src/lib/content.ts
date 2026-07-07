import { createClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "@/lib/supabase/url";
import { FELLOWS as LOCAL_FELLOWS, type Fellow } from "@/data/fellows";
import { SITE_CONTENT, type SiteContent } from "@/data/site-content";

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
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
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

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  published_at: string;
}

function supabaseOrNull() {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Published blog posts, newest first. Empty when Supabase is absent. */
export async function getPosts(): Promise<Post[]> {
  const supabase = supabaseOrNull();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("slug, title, excerpt, body, cover_url, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data as Post[];
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const supabase = supabaseOrNull();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("slug, title, excerpt, body, cover_url, published_at")
      .eq("published", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) return null;
    return (data as Post) ?? null;
  } catch {
    return null;
  }
}

/**
 * Site copy: defaults from src/data/site-content.ts, overridden per
 * section by rows saved from the admin portal (table `content`,
 * key = section name, value = JSON). Shallow-merged per section so
 * fields that were never edited keep their defaults.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return SITE_CONTENT;

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("content").select("key, value");
    if (error || !data) return SITE_CONTENT;

    const merged = structuredClone(SITE_CONTENT) as Record<string, object>;
    for (const row of data) {
      if (row.key in merged && row.value && typeof row.value === "object") {
        merged[row.key] = { ...merged[row.key], ...row.value };
      }
    }
    return merged as unknown as SiteContent;
  } catch {
    return SITE_CONTENT;
  }
}

