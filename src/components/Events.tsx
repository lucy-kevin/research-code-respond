"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Check, MapPin } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type EventsContent = typeof SITE_CONTENT.events;
type UpcomingEvent = EventsContent["upcoming"][number];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/* Deterministic date parts (no Date/locale — server and client render identically). */
function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { day: d, mon: MONTHS[(m ?? 1) - 1] ?? "", year: y };
}

/* Days until the event — computed after mount (rAF) so SSR markup never
   disagrees with the browser clock. */
function useDaysUntil(iso: string) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const target = new Date(`${iso}T00:00:00`).getTime();
      if (!Number.isNaN(target)) {
        setDays(Math.ceil((target - Date.now()) / 86_400_000));
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [iso]);
  return days;
}

const inputCls =
  "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-white";

/* This device remembers who registered for which event, so returning
   visitors see their confirmation instead of the form again. */
const regKey = (slug: string) => `rcr-event-reg:${slug}`;

/* ── Upcoming event: featured card with inline registration ────────── */
function UpcomingCard({ event }: { event: UpcomingEvent }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const days = useDaysUntil(event.dateISO);
  const { day, mon, year } = dateParts(event.dateISO);

  // Restore a previous registration from this device after mount
  // (rAF so server and client render the same initial markup).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(regKey(event.slug));
        if (saved) {
          setRegisteredEmail(saved);
          setDone(true);
        }
      } catch {
        // storage unavailable (private mode etc.) — just show the form
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [event.slug]);

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError(
        "Registration isn't connected yet — email info@researchcoderesolve.org and we'll add you."
      );
      return;
    }
    setBusy(true);
    const email = form.email.trim().toLowerCase();
    const { error } = await supabase.from("event_registrations").insert({
      event_slug: event.slug,
      event_title: event.title,
      name: form.name.trim(),
      email,
    });
    setBusy(false);
    // 23505 = already registered with this email — that's a success for the visitor.
    if (error && error.code !== "23505") {
      setError(
        "Something went wrong — try again, or email info@researchcoderesolve.org."
      );
      return;
    }
    try {
      localStorage.setItem(regKey(event.slug), email);
    } catch {
      // storage unavailable — the DB still knows; nothing to do
    }
    setRegisteredEmail(email);
    setDone(true);
  }

  function resetRegistration() {
    try {
      localStorage.removeItem(regKey(event.slug));
    } catch {
      // ignore
    }
    setRegisteredEmail(null);
    setDone(false);
    setOpen(true);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="overflow-hidden rounded-3xl bg-[#6B21E8]"
    >
      <div className="grid items-center gap-7 p-7 sm:p-9 md:grid-cols-[auto_1fr_auto] md:gap-10">
        {/* Date block */}
        <div className="flex items-baseline gap-3 md:block">
          <p className="font-display text-6xl leading-none text-white sm:text-7xl">
            {day}
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C084FC] md:mt-2">
            {mon} {year}
          </p>
        </div>

        {/* Copy */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E9D5FF]">
              Upcoming · {event.category}
            </span>
            {days !== null && days >= 0 && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-display text-2xl uppercase leading-[1.05] tracking-tight text-white sm:text-3xl">
            {event.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#E9D5FF]">
            {event.blurb}
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#C084FC]">
            <MapPin className="h-3.5 w-3.5" /> {event.location}
          </p>
        </div>

        {/* CTA */}
        {!done && (
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center self-start rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#6B21E8] transition-colors duration-300 hover:bg-[#E9D5FF] md:self-center"
          >
            {open ? "Close" : "Register"}
          </button>
        )}
      </div>

      {/* Inline registration form */}
      <AnimatePresence initial={false}>
        {(open || done) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden border-t border-white/15"
          >
            {done ? (
              <div className="flex flex-wrap items-center gap-3 p-7 sm:p-9">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#6B21E8]">
                  <Check className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">
                    You&apos;re registered
                    {registeredEmail ? (
                      <span className="font-normal text-[#E9D5FF]">
                        {" "}
                        as {registeredEmail}
                      </span>
                    ) : (
                      "."
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-[#E9D5FF]">
                    The meeting invite will land in your inbox before the event.
                  </p>
                </div>
                <button
                  onClick={resetRegistration}
                  className="shrink-0 text-xs font-medium text-[#C084FC] underline-offset-2 transition-colors hover:text-white hover:underline"
                >
                  Not you? Register another email
                </button>
              </div>
            ) : (
              <form
                onSubmit={register}
                className="grid gap-3 p-7 sm:p-9 sm:grid-cols-[1fr_1.2fr_auto]"
              >
                <input
                  required
                  placeholder="Your name"
                  aria-label="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-wide text-[#6B21E8] transition-colors hover:bg-[#E9D5FF] disabled:opacity-60"
                >
                  {busy ? "Saving…" : "Save my seat"}
                </button>
                {error && (
                  <p className="text-sm text-[#FECACA] sm:col-span-3">{error}</p>
                )}
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ── Events page body ───────────────────────────────────────────────── */
export default function Events({
  content = SITE_CONTENT.events,
}: {
  content?: EventsContent;
}) {
  const { list, upcoming } = content;

  return (
    <section className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium tracking-wide text-[#6B21E8]">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-tight text-[#1A1A1A] sm:text-5xl">
            {content.heading}
          </h2>
        </motion.div>

        {/* Upcoming — register */}
        {upcoming.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="h-4 w-4 text-[#6B21E8]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
                {content.upcomingHeading}
              </p>
            </div>
            <p className="mt-2 text-sm text-[#6B7280]">
              {content.upcomingSubheading}
            </p>
            <div className="mt-6 space-y-5">
              {upcoming.map((event) => (
                <UpcomingCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Past — compact timeline */}
        <div className="relative mt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            {content.pastHeading}
          </p>

          <div className="relative mt-8">
            {/* Spine — vivid at the present, fading into the past */}
            <div
              aria-hidden
              className="absolute left-[6px] top-1.5 h-full w-px bg-gradient-to-b from-[#6B21E8] via-[#6B21E8]/30 to-[#1A1A1A]/5 sm:left-[148px]"
            />

            <ol className="space-y-8">
              {list.map((event, i) => {
                const showYear = i === 0 || list[i - 1].year !== event.year;

                return (
                  <li
                    key={`${event.title}-${i}`}
                    className="relative sm:grid sm:grid-cols-[128px_1fr] sm:gap-9"
                  >
                    {/* Date rail */}
                    <div className="mb-4 pl-9 sm:mb-0 sm:pl-0 sm:text-right">
                      {showYear && (
                        <p className="font-display text-2xl leading-none tracking-tight text-[#1A1A1A]">
                          {event.year}
                        </p>
                      )}
                      <p
                        className={`${showYear ? "mt-1.5" : ""} text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6B21E8]`}
                      >
                        {event.date}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#6B7280]">
                        {event.location}
                      </p>
                    </div>

                    {/* Node */}
                    <span
                      aria-hidden
                      className={`absolute left-[6px] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-[#FAF9F5] sm:left-[148px] ${
                        i === 0 ? "bg-[#6B21E8]" : "bg-[#1A1A1A]/25"
                      }`}
                    />

                    {/* Compact card: small photo + copy in one row */}
                    <motion.article
                      initial={{ opacity: 0, x: 32 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="group ml-9 flex overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(26,26,26,0.25)] sm:ml-0"
                    >
                      {event.photoUrl && (
                        <div className="relative hidden w-40 shrink-0 self-stretch overflow-hidden sm:block md:w-48">
                          <Image
                            src={event.photoUrl}
                            alt={event.title}
                            fill
                            sizes="192px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        </div>
                      )}
                      <div className="min-w-0 p-5 sm:p-6">
                        <span className="rounded-full bg-[#E9D5FF]/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6B21E8]">
                          {event.category}
                        </span>
                        <h3 className="mt-2.5 text-lg font-semibold leading-snug text-[#1A1A1A]">
                          {event.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280] line-clamp-2">
                          {event.blurb}
                        </p>
                        {event.href && (
                          <Link
                            href={event.href}
                            className="group/link mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#6B21E8] transition-colors hover:text-[#4C0F9E]"
                          >
                            Learn more
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                          </Link>
                        )}
                      </div>
                    </motion.article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
