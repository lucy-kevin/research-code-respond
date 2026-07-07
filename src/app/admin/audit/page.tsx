"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ScrollText } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface AuditRow {
  id: number;
  actor_email: string;
  action: "insert" | "update" | "delete";
  table_name: string;
  record_id: string;
  details: unknown;
  created_at: string;
}

const ACTION_STYLE: Record<AuditRow["action"], string> = {
  insert: "bg-green-100 text-green-800",
  update: "bg-amber-100 text-amber-800",
  delete: "bg-red-100 text-red-700",
};

const TABLE_LABELS: Record<string, string> = {
  fellows: "Fellows",
  content: "Site content",
  posts: "Blog posts",
  messages: "Messages",
  event_registrations: "Event registrations",
  subscribers: "Subscribers",
  staff: "Staff",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// NEXT_PUBLIC_ vars are inlined at build time, so this is stable across
// server and client renders — no hydration mismatch.
const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminAudit() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(CONFIGURED);
  const [table, setTable] = useState<string>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300)
      .then(({ data }) => {
        setRows((data as AuditRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => (table === "all" ? rows : rows.filter((r) => r.table_name === table)),
    [rows, table]
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portal
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
            Audit log
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
            Every change across the site — who did what, when. Public actions
            (contact form, registrations, newsletter) are logged as
            &ldquo;public&rdquo;.
          </p>
        </div>
        <select
          value={table}
          aria-label="Filter by table"
          onChange={(e) => setTable(e.target.value)}
          className="rounded-xl border border-[#1A1A1A]/15 bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#6B21E8]"
        >
          <option value="all">All tables</option>
          {Object.entries(TABLE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 rounded-2xl border border-[#1A1A1A]/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-[#6B7280]">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="flex items-center gap-3 p-6">
            <ScrollText className="h-5 w-5 text-[#6B7280]" />
            <p className="text-sm text-[#6B7280]">
              Nothing here yet — entries appear as soon as anything changes.
              (Run the updated supabase/schema.sql once to enable logging.)
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#1A1A1A]/6">
            {filtered.map((row) => (
              <li key={row.id}>
                <button
                  onClick={() => setOpenId(openId === row.id ? null : row.id)}
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-left transition-colors hover:bg-[#FAF9F5]"
                >
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${ACTION_STYLE[row.action]}`}
                  >
                    {row.action}
                  </span>
                  <span className="text-sm font-medium text-[#1A1A1A]">
                    {TABLE_LABELS[row.table_name] ?? row.table_name}
                  </span>
                  {row.record_id && (
                    <span className="max-w-[160px] truncate font-mono text-[11px] text-[#6B7280]">
                      {row.record_id}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-[#6B7280]">
                    {row.actor_email} · {formatTime(row.created_at)}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#6B7280] transition-transform ${
                      openId === row.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openId === row.id && (
                  <pre className="max-h-80 overflow-auto border-t border-[#1A1A1A]/6 bg-[#FAF9F5] px-5 py-4 text-xs leading-relaxed text-[#4B5563]">
                    {JSON.stringify(row.details, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
