"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface StaffRow {
  user_id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  created_at: string;
}

const ROLE_HELP: Record<StaffRow["role"], string> = {
  admin: "Everything, including managing staff",
  editor: "Edit content, fellows, posts & events",
  viewer: "Read-only across the portal",
};

const inputCls =
  "w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]";

function randomPassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  return Array.from(crypto.getRandomValues(new Uint32Array(14)))
    .map((n) => chars[n % chars.length])
    .join("");
}

// NEXT_PUBLIC_ vars are inlined at build time, so this is stable across
// server and client renders — no hydration mismatch.
const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(CONFIGURED);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "editor",
    password: "",
  });

  const load = useCallback(() => {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    Promise.all([
      supabase.from("staff").select("*").order("created_at"),
      supabase.auth.getUser(),
    ]).then(([{ data }, { data: auth }]) => {
      setStaff((data as StaffRow[]) ?? []);
      setMyId(auth.user?.id ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function api(method: string, body: object) {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/staff", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage(json.error ?? "Something went wrong.");
      return false;
    }
    return true;
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    const ok = await api("POST", form);
    if (ok) {
      setMessage(
        `Account created. Share these sign-in details with ${form.name || form.email}: ` +
          `${form.email} / ${form.password} (they sign in at /admin/login).`
      );
      setForm({ name: "", email: "", role: "editor", password: "" });
      load();
    }
  }

  async function changeRole(userId: string, role: string) {
    const ok = await api("PATCH", { user_id: userId, role });
    if (ok) load();
  }

  async function remove(row: StaffRow) {
    if (!confirm(`Remove ${row.email}? Their login is deleted too.`)) return;
    const ok = await api("DELETE", { user_id: row.user_id });
    if (ok) load();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portal
      </Link>

      <h1 className="mt-4 font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
        Staff & permissions
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
        Create accounts for the team and choose what each person can do.
        Every change made in the portal is recorded in the audit log.
      </p>

      {/* Invite form */}
      <form
        onSubmit={invite}
        className="mt-8 rounded-2xl border border-[#1A1A1A]/10 bg-white p-6"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-[#6B21E8]" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            Add a staff member
          </h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            placeholder="Full name"
            aria-label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
          <input
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
          />
          <select
            value={form.role}
            aria-label="Role"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className={inputCls}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="flex gap-2">
            <input
              required
              minLength={8}
              placeholder="Temporary password"
              aria-label="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputCls}
            />
            <button
              type="button"
              title="Generate password"
              onClick={() => setForm({ ...form, password: randomPassword() })}
              className="shrink-0 rounded-xl border border-[#1A1A1A]/15 px-3 text-[#6B7280] transition-colors hover:border-[#6B21E8] hover:text-[#6B21E8]"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#6B7280]">
          {ROLE_HELP[form.role as StaffRow["role"]]} — share the email +
          temporary password with them; they sign in at /admin/login.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-full bg-[#6B21E8] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-60"
        >
          {busy ? "Working…" : "Create account"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-xl border border-[#6B21E8]/25 bg-[#E9D5FF]/30 p-4 text-sm text-[#1A1A1A]">
          {message}
        </p>
      )}

      {/* Staff list */}
      <div className="mt-8 rounded-2xl border border-[#1A1A1A]/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#6B21E8]" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            Team
          </h2>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-[#6B7280]">Loading…</p>
        ) : staff.length === 0 ? (
          <p className="mt-4 text-sm text-[#6B7280]">
            No staff rows yet — run the updated supabase/schema.sql once and
            existing logins become admins automatically.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[#1A1A1A]/6">
            {staff.map((row) => (
              <li
                key={row.user_id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {row.name || row.email}
                    {row.user_id === myId && (
                      <span className="ml-2 rounded-full bg-[#E9D5FF]/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#6B21E8]">
                        You
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#6B7280]">
                    {row.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <select
                    value={row.role}
                    disabled={busy || row.user_id === myId}
                    aria-label={`Role for ${row.email}`}
                    onChange={(e) => changeRole(row.user_id, e.target.value)}
                    className="rounded-lg border border-[#1A1A1A]/15 bg-white px-2.5 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#6B21E8] disabled:opacity-60"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {row.user_id !== myId && (
                    <button
                      onClick={() => remove(row)}
                      disabled={busy}
                      aria-label={`Remove ${row.email}`}
                      className="text-[#6B7280] transition-colors hover:text-red-600 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
