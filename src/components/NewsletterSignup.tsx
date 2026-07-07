"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

/** Footer newsletter signup — one email field into the subscribers table. */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Not connected yet — email info@researchcoderesolve.org.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("subscribers")
      .insert({ email: email.trim().toLowerCase() });
    setBusy(false);
    // 23505 = already subscribed — success as far as the visitor is concerned.
    if (error && error.code !== "23505") {
      setError("Something went wrong — please try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm text-[#E9D5FF]">
        <Check className="h-4 w-4 shrink-0" /> You&apos;re on the list — see you
        in your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} className="mt-4">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-w-0 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-white"
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#4C0F9E] transition-colors hover:bg-[#E9D5FF] disabled:opacity-60"
        >
          {busy ? "…" : "Subscribe"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[#FECACA]">{error}</p>}
    </form>
  );
}
