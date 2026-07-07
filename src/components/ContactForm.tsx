"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

const INTERESTS = [
  "Partnership",
  "Training programs",
  "Research collaboration",
  "Volunteering & mentorship",
  "Media & press",
  "Other",
];

const inputCls =
  "w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    interest: INTERESTS[0],
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError(
        "The form isn't connected yet — please email info@researchcoderesolve.org instead."
      );
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("messages").insert(form);
    setBusy(false);
    if (error) {
      setError(
        "Something went wrong — please email info@researchcoderesolve.org instead."
      );
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#6B21E8]/30 bg-[#E9D5FF]/30 p-8 text-center">
        <p className="text-lg font-semibold text-[#1A1A1A]">
          Message received.
        </p>
        <p className="mt-2 text-sm text-[#6B7280]">
          Thank you, {form.name.split(" ")[0]} — we read everything and will
          get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Your name *
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Email address *
          </span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Organization
          </span>
          <input
            value={form.organization}
            onChange={(e) =>
              setForm({ ...form, organization: e.target.value })
            }
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            I&apos;m interested in *
          </span>
          <select
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            className={inputCls}
          >
            {INTERESTS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
          Your message *
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputCls}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-[#6B21E8] px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
