import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "@/lib/supabase/url";

const ROLES = ["admin", "editor", "viewer"] as const;

type Ok = {
  caller: SupabaseClient;
  admin: SupabaseClient;
  userId: string;
};
type Err = { error: string; status: number };

/**
 * Auth users can only be created/deleted with the service-role key, so
 * staff management goes through this route instead of the browser client.
 * Staff *rows* are written with the caller's own session (RLS allows
 * admins) so the audit log attributes every change to the right person;
 * the service client is used only for the auth.admin calls.
 */
async function requireAdmin(): Promise<Ok | Err> {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return { error: "Supabase is not configured.", status: 500 };

  const cookieStore = await cookies();
  const caller = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {}, // read-only in a route handler
    },
  });

  const {
    data: { user },
  } = await caller.auth.getUser();
  if (!user) return { error: "Not signed in.", status: 401 };

  const { data: me } = await caller
    .from("staff")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (me?.role !== "admin") {
    return { error: "Only admins can manage staff.", status: 403 };
  }

  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!service) {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (and Vercel env) from Supabase → Settings → API keys, then restart.",
      status: 501,
    };
  }

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return { caller, admin, userId: user.id };
}

/** Create a staff account: auth user + staff row. */
export async function POST(req: NextRequest) {
  const ctx = await requireAdmin();
  if ("error" in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
  }

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim();
  const role = String(body?.role ?? "editor");
  const password = String(body?.password ?? "");

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and a password of at least 8 characters are required." },
      { status: 400 }
    );
  }
  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const { data: created, error: createError } =
    await ctx.admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Could not create the account." },
      { status: 400 }
    );
  }

  // Written as the calling admin so the audit log names them as the actor.
  const { error: staffError } = await ctx.caller.from("staff").insert({
    user_id: created.user.id,
    email,
    name,
    role,
  });
  if (staffError) {
    await ctx.admin.auth.admin.deleteUser(created.user.id); // don't leave an orphan login
    return NextResponse.json({ error: staffError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, user_id: created.user.id });
}

/** Change a staff member's role or name. */
export async function PATCH(req: NextRequest) {
  const ctx = await requireAdmin();
  if ("error" in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
  }

  const body = await req.json().catch(() => null);
  const userId = String(body?.user_id ?? "");
  const role = String(body?.role ?? "");
  if (!userId || !ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (userId === ctx.userId && role !== "admin") {
    return NextResponse.json(
      { error: "You can't demote your own account — ask another admin." },
      { status: 400 }
    );
  }

  const { error } = await ctx.caller
    .from("staff")
    .update({ role })
    .eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

/** Remove a staff account entirely (staff row + login). */
export async function DELETE(req: NextRequest) {
  const ctx = await requireAdmin();
  if ("error" in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
  }

  const body = await req.json().catch(() => null);
  const userId = String(body?.user_id ?? "");
  if (!userId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (userId === ctx.userId) {
    return NextResponse.json(
      { error: "You can't remove your own account — ask another admin." },
      { status: 400 }
    );
  }

  // Audited delete of the staff row first, then the login itself.
  const { error: staffError } = await ctx.caller
    .from("staff")
    .delete()
    .eq("user_id", userId);
  if (staffError) {
    return NextResponse.json({ error: staffError.message }, { status: 400 });
  }
  const { error: authError } = await ctx.admin.auth.admin.deleteUser(userId);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
