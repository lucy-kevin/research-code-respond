"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase is not configured. Add the env keys first.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Research Code Respond content portal.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#6B21E8]"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#6B21E8] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4C0F9E] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
