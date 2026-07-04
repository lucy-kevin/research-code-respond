"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Pencil, Trash2, Star } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface FellowRow {
  id: string;
  name: string;
  country: string;
  code: string;
  track: string;
  profession: string;
  bio: string;
  why: string;
  hope: string;
  photo_url: string | null;
  featured: boolean;
}

const EMPTY: Omit<FellowRow, "id"> = {
  name: "",
  country: "",
  code: "",
  track: "",
  profession: "",
  bio: "",
  why: "",
  hope: "",
  photo_url: null,
  featured: false,
};

const TRACKS = [
  "",
  "Data for Social Good",
  "Frontend Web Development",
  "Backend Engineering",
  "Mobile Development",
  "Human-Centered Design",
];

async function fetchRows(): Promise<{
  rows: FellowRow[];
  error: string | null;
}> {
  const supabase = supabaseBrowser();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }
  const { data, error } = await supabase
    .from("fellows")
    .select("*")
    .order("name");
  if (error) return { rows: [], error: error.message };
  return { rows: (data as FellowRow[]) ?? [], error: null };
}

export default function AdminFellows() {
  const [rows, setRows] = useState<FellowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FellowRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<FellowRow, "id">>(EMPTY);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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

  function openEdit(row: FellowRow) {
    setEditing(row);
    setCreating(false);
    setForm({ ...row });
    setPhotoFile(null);
    setError(null);
  }

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm(EMPTY);
    setPhotoFile(null);
    setError(null);
  }

  function closeForm() {
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      let photo_url = form.photo_url;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const path = `fellows/${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("photos")
          .upload(path, photoFile, { upsert: true });
        if (upErr) throw upErr;
        photo_url = supabase.storage.from("photos").getPublicUrl(path)
          .data.publicUrl;
      }

      const payload = { ...form, photo_url };
      const { error: dbErr } = editing
        ? await supabase.from("fellows").update(payload).eq("id", editing.id)
        : await supabase.from("fellows").insert(payload);
      if (dbErr) throw dbErr;

      closeForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: FellowRow) {
    if (!confirm(`Remove ${row.name} from the cohort?`)) return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.from("fellows").delete().eq("id", row.id);
    if (error) setError(error.message);
    else await load();
  }

  async function toggleFeatured(row: FellowRow) {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase
      .from("fellows")
      .update({ featured: !row.featured })
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
          Fellows
        </h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-[#6B21E8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4C0F9E]"
        >
          <Plus className="h-4 w-4" /> Add fellow
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
          No fellows in the database yet. Run the seed script or add one above.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1A1A1A]/10 bg-[#FAF9F5] text-xs uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-5 py-3.5">Fellow</th>
                <th className="hidden px-5 py-3.5 md:table-cell">Country</th>
                <th className="hidden px-5 py-3.5 lg:table-cell">Track</th>
                <th className="px-5 py-3.5 text-center">Featured</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF9F5]/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {row.photo_url ? (
                        <Image
                          src={row.photo_url}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover object-top"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9D5FF] text-xs font-semibold text-[#4C0F9E]">
                          {row.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-[#1A1A1A]">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-[#6B7280] md:table-cell">
                    {row.country}
                  </td>
                  <td className="hidden px-5 py-3 text-[#6B7280] lg:table-cell">
                    {row.track}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(row)}
                      title="Show in the homepage strip"
                      className={
                        row.featured ? "text-[#6B21E8]" : "text-[#1A1A1A]/20"
                      }
                    >
                      <Star
                        className="h-4 w-4"
                        fill={row.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
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
              {editing ? `Edit ${editing.name}` : "Add fellow"}
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name *">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Profession">
                <input
                  value={form.profession}
                  onChange={(e) =>
                    setForm({ ...form, profession: e.target.value })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Country">
                <input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Flag code (e.g. ke, ug, ng)">
                <input
                  value={form.code}
                  maxLength={2}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toLowerCase() })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Track">
                <select
                  value={form.track}
                  onChange={(e) => setForm({ ...form, track: e.target.value })}
                  className={inputCls}
                >
                  {TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t || "— none —"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-[#6B7280] file:mr-3 file:rounded-full file:border-0 file:bg-[#E9D5FF] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#4C0F9E]"
                />
              </Field>
            </div>

            <div className="mt-4 space-y-4">
              <Field label="Bio (third person, 50–70 words)">
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Why I joined">
                <textarea
                  rows={3}
                  value={form.why}
                  onChange={(e) => setForm({ ...form, why: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="What I hope to build">
                <textarea
                  rows={3}
                  value={form.hope}
                  onChange={(e) => setForm({ ...form, hope: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-[#4B5563]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#6B21E8]"
                />
                Featured on the homepage strip
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
