"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, MailOpen, Mail } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface MessageRow {
  id: string;
  name: string;
  email: string;
  organization: string;
  interest: string;
  message: string;
  read: boolean;
  created_at: string;
}

async function fetchRows(): Promise<{
  rows: MessageRow[];
  error: string | null;
}> {
  const supabase = supabaseBrowser();
  if (!supabase) return { rows: [], error: "Supabase is not configured." };
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: error.message };
  return { rows: (data as MessageRow[]) ?? [], error: null };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessages() {
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await fetchRows();
    setRows(result.rows);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRows().then((result) => {
      setRows(result.rows);
      setError(result.error);
      setLoading(false);
    });
  }, []);

  async function toggleOpen(row: MessageRow) {
    const next = openId === row.id ? null : row.id;
    setOpenId(next);
    if (next && !row.read) {
      const supabase = supabaseBrowser();
      if (!supabase) return;
      await supabase.from("messages").update({ read: true }).eq("id", row.id);
      await load();
    }
  }

  async function remove(row: MessageRow) {
    if (!confirm(`Delete the message from ${row.name}?`)) return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", row.id);
    if (error) setError(error.message);
    else await load();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portal
      </Link>

      <h1 className="mt-4 font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
        Messages
      </h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        Everything sent through the contact form.
      </p>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-[#6B7280]">Loading…</p>
      ) : rows.length === 0 && !error ? (
        <p className="mt-10 text-sm text-[#6B7280]">No messages yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`rounded-2xl border bg-white transition-colors ${
                row.read ? "border-[#1A1A1A]/10" : "border-[#6B21E8]/50"
              }`}
            >
              <button
                onClick={() => toggleOpen(row)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                {row.read ? (
                  <MailOpen className="h-4 w-4 shrink-0 text-[#6B7280]" />
                ) : (
                  <Mail className="h-4 w-4 shrink-0 text-[#6B21E8]" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${
                      row.read
                        ? "text-[#4B5563]"
                        : "font-semibold text-[#1A1A1A]"
                    }`}
                  >
                    {row.name}
                    <span className="ml-2 font-normal text-[#6B7280]">
                      — {row.interest}
                    </span>
                  </p>
                  <p className="truncate text-xs text-[#6B7280]">
                    {row.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[#6B7280]">
                  {formatDate(row.created_at)}
                </span>
              </button>

              {openId === row.id && (
                <div className="border-t border-[#1A1A1A]/8 px-5 py-4">
                  <p className="text-xs text-[#6B7280]">
                    <a
                      href={`mailto:${row.email}`}
                      className="text-[#6B21E8] hover:underline"
                    >
                      {row.email}
                    </a>
                    {row.organization && ` · ${row.organization}`}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#374151]">
                    {row.message}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => remove(row)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
