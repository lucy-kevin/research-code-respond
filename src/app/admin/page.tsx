"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, ArrowUpRight, LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const router = useRouter();

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
            Content portal
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Update the site without touching code. Changes go live within a
            minute.
          </p>
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/15 px-4 py-2 text-sm text-[#4B5563] transition-colors hover:border-[#6B21E8] hover:text-[#6B21E8]"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/fellows"
          className="group rounded-2xl border border-[#1A1A1A]/10 bg-white p-6 transition-all hover:border-[#6B21E8]/50 hover:shadow-[0_8px_24px_rgba(26,26,26,0.06)]"
        >
          <div className="flex items-start justify-between">
            <Users className="h-6 w-6 text-[#6B21E8]" />
            <ArrowUpRight className="h-4 w-4 text-[#6B7280] transition-colors group-hover:text-[#6B21E8]" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#1A1A1A]">Fellows</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Add, edit, feature, or remove cohort fellows — bios, photos,
            tracks, and their stories.
          </p>
        </Link>

        <div className="rounded-2xl border border-dashed border-[#1A1A1A]/15 p-6">
          <h2 className="text-lg font-semibold text-[#6B7280]">
            Partners, stats &amp; pages
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]/80">
            Coming next — the same pattern extends to every section.
          </p>
        </div>
      </div>
    </main>
  );
}
