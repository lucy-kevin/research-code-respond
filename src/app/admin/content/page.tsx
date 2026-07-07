"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Upload } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";
import { SITE_CONTENT, type SectionKey } from "@/data/site-content";

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Homepage — Hero",
  banner: "Homepage — Photo banner",
  impact: "Homepage — Impact stats",
  whatWeDo: "Homepage — What we do",
  trust: "Homepage — Trust carousel",
  problems: "Homepage — Problems we're solving",
  fellowsSection: "Homepage — Fellows heading",
  partners: "Homepage — Partners",
  joinCta: "Homepage — Join CTA",
  footer: "Footer",
  academy: "Academy page",
  pillars: "Pillars page",
  team: "Team page",
  partnership: "Partner page",
  events: "Events page",
};

type Json = string | number | boolean | Json[] | { [k: string]: Json };

function humanize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

const inputCls =
  "w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]";

/** Recursive editor for any JSON-shaped content value. */
function ValueEditor({
  value,
  onChange,
  label,
  onUpload,
}: {
  value: Json;
  onChange: (v: Json) => void;
  label?: string;
  onUpload: (file: File) => Promise<string | null>;
}) {
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-[#4B5563]">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[#6B21E8]"
        />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        {label && <FieldLabel text={label} />}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputCls}
        />
      </label>
    );
  }

  if (typeof value === "string") {
    const isImage = /url$/i.test(label ?? "");
    const long = value.length > 90;
    return (
      <label className="block">
        {label && <FieldLabel text={label} />}
        <div className="flex gap-2">
          {long ? (
            <textarea
              rows={3}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={inputCls}
            />
          ) : (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={inputCls}
            />
          )}
          {isImage && (
            <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[#1A1A1A]/15 px-3 text-xs font-medium text-[#6B21E8] transition-colors hover:border-[#6B21E8]">
              <Upload className="h-3.5 w-3.5" />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await onUpload(file);
                  if (url) onChange(url);
                }}
              />
            </label>
          )}
        </div>
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div>
        {label && <FieldLabel text={`${label} (${value.length})`} />}
        <div className="space-y-4">
          {value.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#1A1A1A]/10 bg-[#FAF9F5] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280]">
                  #{i + 1}
                </span>
                <button
                  onClick={() =>
                    onChange(value.filter((_, j) => j !== i) as Json)
                  }
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <ValueEditor
                value={item}
                onChange={(v) =>
                  onChange(value.map((x, j) => (j === i ? v : x)) as Json)
                }
                onUpload={onUpload}
              />
            </div>
          ))}
          <button
            onClick={() => {
              const template = value[0];
              const blank =
                typeof template === "object" && template !== null
                  ? (JSON.parse(
                      JSON.stringify(template, (_, v) =>
                        typeof v === "string" ? "" : v
                      )
                    ) as Json)
                  : typeof template === "string"
                    ? ""
                    : template ?? "";
              onChange([...value, blank] as Json);
            }}
            className="rounded-full border border-[#1A1A1A]/15 px-4 py-2 text-xs font-medium text-[#4B5563] transition-colors hover:border-[#6B21E8] hover:text-[#6B21E8]"
          >
            + Add item
          </button>
        </div>
      </div>
    );
  }

  // object
  return (
    <div className="space-y-4">
      {label && <FieldLabel text={label} />}
      {Object.entries(value).map(([k, v]) => (
        <ValueEditor
          key={k}
          label={humanize(k)}
          value={v}
          onChange={(nv) => onChange({ ...value, [k]: nv })}
          onUpload={onUpload}
        />
      ))}
    </div>
  );
}

function FieldLabel({ text }: { text: string }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
      {text}
    </span>
  );
}

async function fetchSection(section: SectionKey): Promise<Json> {
  const defaults = SITE_CONTENT[section] as unknown as Record<string, Json>;
  const supabase = supabaseBrowser();
  if (!supabase) return { ...defaults };
  const { data } = await supabase
    .from("content")
    .select("value")
    .eq("key", section)
    .maybeSingle();
  const saved = (data?.value ?? {}) as Record<string, Json>;
  return { ...defaults, ...saved };
}

export default function AdminContent() {
  const [section, setSection] = useState<SectionKey>("hero");
  const [loaded, setLoaded] = useState<{
    section: SectionKey;
    value: Json;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSection(section).then((value) => {
      if (alive) setLoaded({ section, value });
    });
    return () => {
      alive = false;
    };
  }, [section]);

  const draft = loaded?.section === section ? loaded.value : null;
  const setDraft = (value: Json) => setLoaded({ section, value });

  function switchSection(key: SectionKey) {
    setSection(key);
    setMessage(null);
  }

  async function handleUpload(file: File): Promise<string | null> {
    const supabase = supabaseBrowser();
    if (!supabase) return null;
    const { blob, ext, contentType } = await compressImage(file);
    const path = `site/${section}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(path, blob, { upsert: true, contentType });
    if (error) {
      setMessage(`Upload failed: ${error.message}`);
      return null;
    }
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  async function save() {
    const supabase = supabaseBrowser();
    if (!supabase || draft === null) return;
    setBusy(true);
    setMessage(null);
    const { error } = await supabase
      .from("content")
      .upsert({ key: section, value: draft, updated_at: new Date().toISOString() });
    setBusy(false);
    setMessage(error ? `Save failed: ${error.message}` : "Saved. Live within a minute.");
  }

  async function resetToDefaults() {
    if (!confirm("Discard saved edits for this section and go back to the built-in copy?"))
      return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    await supabase.from("content").delete().eq("key", section);
    setDraft(SITE_CONTENT[section] as unknown as Json);
    setMessage("Reset to defaults.");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portal
      </Link>

      <h1 className="mt-4 font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
        Site content
      </h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        Pick a section, edit, save. Empty fields fall back to nothing — use
        Reset to return to the built-in copy.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Section nav */}
        <nav className="flex flex-row flex-wrap gap-2 lg:flex-col">
          {(Object.keys(SITE_CONTENT) as SectionKey[]).map((key) => (
            <button
              key={key}
              onClick={() => switchSection(key)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                section === key
                  ? "bg-[#6B21E8] font-medium text-white"
                  : "bg-white text-[#4B5563] hover:bg-[#E9D5FF]/40"
              }`}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </nav>

        {/* Editor */}
        <div className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-6 sm:p-8">
          {draft === null ? (
            <p className="text-sm text-[#6B7280]">Loading…</p>
          ) : (
            <>
              <ValueEditor
                value={draft}
                onChange={setDraft}
                onUpload={handleUpload}
              />
              {message && (
                <p
                  className={`mt-5 text-sm ${
                    message.startsWith("Saved") || message.startsWith("Reset")
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
              <div className="mt-7 flex items-center justify-between border-t border-[#1A1A1A]/8 pt-6">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-red-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset to defaults
                </button>
                <button
                  onClick={save}
                  disabled={busy}
                  className="rounded-full bg-[#6B21E8] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-60"
                >
                  {busy ? "Saving…" : "Save section"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
