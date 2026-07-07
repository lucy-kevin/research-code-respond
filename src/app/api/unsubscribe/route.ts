import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "@/lib/supabase/url";
import { newsletterSecret, unsubscribeToken } from "@/lib/newsletter";

function page(title: string, body: string) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#FAF9F5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:420px;padding:40px;text-align:center;">
    <p style="font-size:15px;font-weight:bold;color:#1A1A1A;margin:0;">Research <span style="color:#6B21E8;">|</span> Code <span style="color:#6B21E8;">|</span> Respond</p>
    <h1 style="font-size:22px;color:#1A1A1A;margin:24px 0 8px;">${title}</h1>
    <p style="font-size:14px;line-height:1.6;color:#6B7280;margin:0;">${body}</p>
  </div>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

/** Signed one-click unsubscribe target used in every newsletter email. */
export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get("email") ?? "").trim().toLowerCase();
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const secret = newsletterSecret();

  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!email || !token || !secret || !url || !service) {
    return page(
      "Something's missing",
      "This unsubscribe link is incomplete — please email info@researchcoderesolve.org and we'll remove you by hand."
    );
  }
  if (token !== unsubscribeToken(email, secret)) {
    return page(
      "Link not valid",
      "This unsubscribe link doesn't check out. Please use the link from a recent email, or write to info@researchcoderesolve.org."
    );
  }

  const supabase = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  await supabase.from("subscribers").delete().eq("email", email);

  return page(
    "You're unsubscribed",
    `${email} won't receive our newsletter anymore. Changed your mind? You can re-subscribe any time from the site footer.`
  );
}
