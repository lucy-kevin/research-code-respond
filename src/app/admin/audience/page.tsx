"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Check,
  Mail,
  Trash2,
  Upload,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface Registration {
  id: string;
  event_slug: string;
  event_title: string;
  name: string;
  email: string;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Copy-to-clipboard button that flashes a check on success. */
function CopyEmails({ emails, label }: { emails: string[]; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      disabled={emails.length === 0}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#6B21E8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-50"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

// NEXT_PUBLIC_ vars are inlined at build time, so this is stable across
// server and client renders — no hydration mismatch.
const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminAudience() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(CONFIGURED);
  const [importText, setImportText] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    Promise.all([
      supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false }),
    ]).then(([regs, subs]) => {
      setRegistrations((regs.data as Registration[]) ?? []);
      setSubscribers((subs.data as Subscriber[]) ?? []);
      setLoading(false);
    });
  }, []);

  // Group registrations per event, newest event group first.
  const groups = useMemo(() => {
    const map = new Map<string, Registration[]>();
    for (const r of registrations) {
      const list = map.get(r.event_slug) ?? [];
      list.push(r);
      map.set(r.event_slug, list);
    }
    return [...map.entries()];
  }, [registrations]);

  async function removeRegistration(id: string) {
    if (!confirm("Remove this registration?")) return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", id);
    if (!error) setRegistrations((rs) => rs.filter((r) => r.id !== id));
  }

  /* Paste anything — a CSV export, a comma list, one address per line —
     and every valid email in it gets subscribed (duplicates skipped). */
  async function importEmails() {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const found = [
      ...new Set(
        (importText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? []).map((e) =>
          e.toLowerCase()
        )
      ),
    ];
    if (found.length === 0) {
      setImportResult("No email addresses found in the pasted text.");
      return;
    }
    setImportBusy(true);
    setImportResult(null);
    const { data, error } = await supabase
      .from("subscribers")
      .upsert(
        found.map((email) => ({ email })),
        { onConflict: "email", ignoreDuplicates: true }
      )
      .select();
    setImportBusy(false);
    if (error) {
      setImportResult(`Import failed: ${error.message}`);
      return;
    }
    const added = data?.length ?? 0;
    setImportResult(
      `${added} added, ${found.length - added} already subscribed.`
    );
    setImportText("");
    if (added > 0) {
      const { data: subs } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      setSubscribers((subs as Subscriber[]) ?? []);
    }
  }

  async function removeSubscriber(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (!error) setSubscribers((ss) => ss.filter((s) => s.id !== id));
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
        Audience
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
        Event registrations and newsletter subscribers. To send a meeting
        invite: copy the emails below, then paste them into the guest field of
        a Google Calendar event (a Meet link is created automatically) or your
        Zoom invite.
      </p>

      {loading ? (
        <p className="mt-10 text-sm text-[#6B7280]">Loading…</p>
      ) : (
        <>
          {/* ── Event registrations ── */}
          <div className="mt-10 flex items-center gap-2.5">
            <CalendarDays className="h-4 w-4 text-[#6B21E8]" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
              Event registrations
            </h2>
          </div>

          {groups.length === 0 ? (
            <p className="mt-4 text-sm text-[#6B7280]">
              No registrations yet — they&apos;ll appear here as people sign up
              on the Events page.
            </p>
          ) : (
            groups.map(([slug, regs]) => (
              <div
                key={slug}
                className="mt-5 rounded-2xl border border-[#1A1A1A]/10 bg-white p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">
                      {regs[0].event_title || slug}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      {regs.length} registered
                    </p>
                  </div>
                  <CopyEmails
                    emails={regs.map((r) => r.email)}
                    label="Copy emails for invite"
                  />
                </div>
                <ul className="mt-4 divide-y divide-[#1A1A1A]/6">
                  {regs.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[#1A1A1A]">
                          {r.name}{" "}
                          <span className="text-[#6B7280]">· {r.email}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs text-[#6B7280]">
                          {formatDate(r.created_at)}
                        </span>
                        <button
                          onClick={() => removeRegistration(r.id)}
                          aria-label={`Remove ${r.email}`}
                          className="text-[#6B7280] transition-colors hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          {/* ── Newsletter subscribers ── */}
          <div className="mt-12 flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-[#6B21E8]" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
              Newsletter subscribers
            </h2>
          </div>

          <div className="mt-5 rounded-2xl border border-[#1A1A1A]/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#6B7280]">
                {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
              </p>
              <CopyEmails
                emails={subscribers.map((s) => s.email)}
                label="Copy all emails"
              />
            </div>
            {/* Bulk import */}
            <div className="mt-5 rounded-xl border border-dashed border-[#1A1A1A]/15 bg-[#FAF9F5] p-4">
              <div className="flex items-center gap-2">
                <Upload className="h-3.5 w-3.5 text-[#6B21E8]" />
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  Import subscribers
                </p>
              </div>
              <textarea
                rows={3}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste emails here — a CSV export, comma-separated, or one per line. We'll pick out every valid address."
                className="mt-3 w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]"
              />
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={importEmails}
                  disabled={importBusy || !importText.trim()}
                  className="rounded-full bg-[#6B21E8] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-50"
                >
                  {importBusy ? "Importing…" : "Import"}
                </button>
                {importResult && (
                  <p className="text-xs text-[#6B7280]">{importResult}</p>
                )}
              </div>
            </div>

            {subscribers.length > 0 && (
              <ul className="mt-4 divide-y divide-[#1A1A1A]/6">
                {subscribers.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <p className="truncate text-sm text-[#1A1A1A]">{s.email}</p>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-[#6B7280]">
                        {formatDate(s.created_at)}
                      </span>
                      <button
                        onClick={() => removeSubscriber(s.id)}
                        aria-label={`Remove ${s.email}`}
                        className="text-[#6B7280] transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </main>
  );
}
