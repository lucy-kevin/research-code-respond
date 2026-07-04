/**
 * Normalizes a Supabase URL. People often paste the dashboard link
 * (https://supabase.com/dashboard/project/<ref>) instead of the API URL
 * (https://<ref>.supabase.co) — recover the right one automatically.
 */
export function normalizeSupabaseUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const dashboard = raw.match(
    /supabase\.com\/dashboard\/project\/([a-z0-9-]+)/i
  );
  if (dashboard) return `https://${dashboard[1]}.supabase.co`;
  return raw.replace(/\/+$/, "");
}
