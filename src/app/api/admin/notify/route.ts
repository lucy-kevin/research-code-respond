import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { normalizeSupabaseUrl } from "@/lib/supabase/url";
import {
  newsletterSecret,
  postEmailHtml,
  unsubscribeToken,
} from "@/lib/newsletter";

const BATCH_SIZE = 100; // Resend's per-call batch limit

/**
 * Email every newsletter subscriber about a published post.
 * POST { post_id } — staff (admin or editor) only.
 *
 * Sends through Resend (https://resend.com): set RESEND_API_KEY and
 * NEWSLETTER_FROM (a verified sender like "RCR <news@researchcoderesolve.org>")
 * in the environment. Each recipient gets their own email with a signed
 * unsubscribe link — addresses are never exposed to each other.
 */
export async function POST(req: NextRequest) {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const cookieStore = await cookies();
  const caller = createServerClient(url, anon, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  });

  const {
    data: { user },
  } = await caller.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { data: me } = await caller
    .from("staff")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me || !["admin", "editor"].includes(me.role)) {
    return NextResponse.json(
      { error: "Only admins and editors can email subscribers." },
      { status: 403 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const secret = newsletterSecret();
  if (!apiKey || !from || !secret) {
    return NextResponse.json(
      {
        error:
          "Email sending isn't configured yet. Create a free resend.com account, verify the researchcoderesolve.org domain, then set RESEND_API_KEY and NEWSLETTER_FROM (e.g. \"Research Code Respond <news@researchcoderesolve.org>\") in the environment.",
      },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const postId = String(body?.post_id ?? "");
  const force = Boolean(body?.force);
  if (!postId) {
    return NextResponse.json({ error: "post_id is required." }, { status: 400 });
  }

  const { data: post } = await caller
    .from("posts")
    .select("id, slug, title, excerpt, published, notified_at")
    .eq("id", postId)
    .maybeSingle();
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  if (!post.published) {
    return NextResponse.json(
      { error: "Publish the post first, then email subscribers." },
      { status: 400 }
    );
  }
  if (post.notified_at && !force) {
    return NextResponse.json(
      {
        error: `Subscribers were already emailed about this post on ${new Date(post.notified_at).toLocaleDateString("en-GB")}.`,
        already_notified: true,
      },
      { status: 409 }
    );
  }

  const { data: subs } = await caller.from("subscribers").select("email");
  const emails = (subs ?? []).map((s) => s.email as string);
  if (emails.length === 0) {
    return NextResponse.json(
      { error: "No subscribers yet — nothing to send." },
      { status: 400 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const postUrl = `${origin}/blog/${post.slug}`;

  let sent = 0;
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const chunk = emails.slice(i, i + BATCH_SIZE).map((email) => ({
      from,
      to: [email],
      subject: post.title,
      html: postEmailHtml({
        title: post.title,
        excerpt: post.excerpt || "Fresh from the Research Code Respond studio.",
        postUrl,
        unsubscribeUrl: `${origin}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email, secret)}`,
      }),
    }));

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Email provider rejected the send after ${sent} emails: ${detail.slice(0, 300)}`,
        },
        { status: 502 }
      );
    }
    sent += chunk.length;
  }

  // Stamp the post (with the caller's session, so the audit log names them).
  await caller
    .from("posts")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", post.id);

  return NextResponse.json({ ok: true, sent });
}
