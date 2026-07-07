"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, Send } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  published: boolean;
  published_at: string;
  notified_at: string | null;
}

const EMPTY: Omit<PostRow, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_url: null,
  published: false,
  published_at: new Date().toISOString(),
  notified_at: null,
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchRows(): Promise<{ rows: PostRow[]; error: string | null }> {
  const supabase = supabaseBrowser();
  if (!supabase) return { rows: [], error: "Supabase is not configured." };
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) return { rows: [], error: error.message };
  return { rows: (data as PostRow[]) ?? [], error: null };
}

export default function AdminPosts() {
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<PostRow, "id">>(EMPTY);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function openEdit(row: PostRow) {
    setEditing(row);
    setCreating(false);
    setForm({ ...row });
    setCoverFile(null);
    setError(null);
  }

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm({ ...EMPTY, published_at: new Date().toISOString() });
    setCoverFile(null);
    setError(null);
  }

  function closeForm() {
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const slug = form.slug.trim() || slugify(form.title);
      let cover_url = form.cover_url;

      if (coverFile) {
        const { blob, ext, contentType } = await compressImage(coverFile);
        const path = `blog/${slug}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("photos")
          .upload(path, blob, { upsert: true, contentType });
        if (upErr) throw upErr;
        cover_url = supabase.storage.from("photos").getPublicUrl(path)
          .data.publicUrl;
      }

      const payload = { ...form, slug, cover_url };
      const { error: dbErr } = editing
        ? await supabase.from("posts").update(payload).eq("id", editing.id)
        : await supabase.from("posts").insert(payload);
      if (dbErr) throw dbErr;

      closeForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: PostRow) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.from("posts").delete().eq("id", row.id);
    if (error) setError(error.message);
    else await load();
  }

  async function notifySubscribers(row: PostRow) {
    const again = row.notified_at
      ? "\n\nSubscribers were already emailed about this post — send again anyway?"
      : "";
    if (!confirm(`Email all newsletter subscribers about "${row.title}"?${again}`))
      return;
    setBusy(true);
    const res = await fetch("/api/admin/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: row.id, force: Boolean(row.notified_at) }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Sending failed.");
      return;
    }
    setError(null);
    alert(`Sent to ${json.sent} subscriber${json.sent === 1 ? "" : "s"}.`);
    await load();
  }

  async function togglePublished(row: PostRow) {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase
      .from("posts")
      .update({ published: !row.published })
      .eq("id", row.id);
    if (error) setError(error.message);
    else await load();
  }

  const formOpen = creating || editing !== null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portal
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
          Blog posts
        </h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-[#6B21E8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4C0F9E]"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {error && !formOpen && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-[#6B7280]">Loading…</p>
      ) : rows.length === 0 && !error ? (
        <p className="mt-10 text-sm text-[#6B7280]">
          No posts yet. Write the first one.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1A1A1A]/10 bg-[#FAF9F5] text-xs uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-5 py-3.5">Post</th>
                <th className="hidden px-5 py-3.5 md:table-cell">Slug</th>
                <th className="px-5 py-3.5 text-center">Published</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF9F5]/60">
                  <td className="px-5 py-3 font-medium text-[#1A1A1A]">
                    {row.title}
                  </td>
                  <td className="hidden px-5 py-3 text-[#6B7280] md:table-cell">
                    /blog/{row.slug}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => togglePublished(row)}
                      title={row.published ? "Unpublish" : "Publish"}
                      className={
                        row.published ? "text-[#6B21E8]" : "text-[#1A1A1A]/25"
                      }
                    >
                      {row.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {row.published && (
                        <button
                          onClick={() => notifySubscribers(row)}
                          disabled={busy}
                          title={
                            row.notified_at
                              ? `Subscribers emailed ${new Date(row.notified_at).toLocaleDateString("en-GB")} — click to send again`
                              : "Email subscribers about this post"
                          }
                          className={`rounded-lg border p-2 transition-colors disabled:opacity-50 ${
                            row.notified_at
                              ? "border-[#6B21E8]/30 bg-[#E9D5FF]/40 text-[#6B21E8]"
                              : "border-[#1A1A1A]/10 text-[#6B7280] hover:border-[#6B21E8] hover:text-[#6B21E8]"
                          }`}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(row)}
                        className="rounded-lg border border-[#1A1A1A]/10 p-2 text-[#6B7280] transition-colors hover:border-[#6B21E8] hover:text-[#6B21E8]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(row)}
                        className="rounded-lg border border-[#1A1A1A]/10 p-2 text-[#6B7280] transition-colors hover:border-red-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / create drawer */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-7"
          >
            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              {editing ? `Edit "${editing.title}"` : "New post"}
            </h2>

            <div className="mt-6 space-y-4">
              <Field label="Title *">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: editing ? form.slug : slugify(e.target.value),
                    })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: slugify(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Excerpt (short summary shown on the list)">
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Body (separate paragraphs with a blank line)">
                <textarea
                  rows={10}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Cover image">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-[#6B7280] file:mr-3 file:rounded-full file:border-0 file:bg-[#E9D5FF] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#4C0F9E]"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-[#4B5563]">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#6B21E8]"
                />
                Published (visible on the site)
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={closeForm}
                className="rounded-full border border-[#1A1A1A]/15 px-5 py-2.5 text-sm text-[#4B5563] transition-colors hover:border-[#1A1A1A]/40"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="rounded-full bg-[#6B21E8] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
        {label}
      </span>
      {children}
    </label>
  );
}
