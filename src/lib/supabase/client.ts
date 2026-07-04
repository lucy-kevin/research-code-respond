"use client";

import { createBrowserClient } from "@supabase/ssr";
import { normalizeSupabaseUrl } from "./url";

export function supabaseBrowser() {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
