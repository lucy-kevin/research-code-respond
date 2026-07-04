"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote } from "lucide-react";
import { FELLOWS, type Fellow } from "@/data/fellows";
import { countriesOf } from "@/lib/countries";

const EASE = [0.16, 1, 0.3, 1] as const;

const TRACKS = [
  "All",
  "Data for Social Good",
  "Frontend Web Development",
  "Backend Engineering",
  "Mobile Development",
];

function excerpt(text: string, max = 130) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Portrait({ fellow, sizes }: { fellow: Fellow; sizes: string }) {
  if (fellow.photo) {
    return (
      <Image
        src={fellow.photo}
        alt={fellow.name}
        fill
        sizes={sizes}
        className="object-cover object-top"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6B21E8] to-[#4C0F9E]">
      <span className="font-display text-4xl text-white/90">
        {initials(fellow.name)}
      </span>
    </div>
  );
}

export default function FellowsGrid({
  fellows = FELLOWS,
}: {
  fellows?: Fellow[];
}) {
  const [track, setTrack] = useState("All");
  const [selected, setSelected] = useState<Fellow | null>(null);

  const countries = countriesOf(fellows);
  const visible =
    track === "All" ? fellows : fellows.filter((f) => f.track === track);

  return (
    <section id="fellows" className="bg-[#FAF9F5] px-6 pb-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10 max-w-2xl"
        >
          <p className="text-sm font-medium tracking-wide text-[#6B21E8]">
            Bootcamp 2026
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-tight text-[#1A1A1A] sm:text-5xl">
            The full cohort
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            {fellows.length} fellows from {countries.length} countries. Tap
            anyone to read their story — who they are, why they joined, and
            what they came to build.
          </p>
        </motion.div>

        {/* Track filters */}
        <div className="mb-12 flex flex-wrap gap-2.5">
          {TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                track === t
                  ? "bg-[#6B21E8] text-white"
                  : "border border-[#1A1A1A]/15 bg-white text-[#4B5563] hover:border-[#6B21E8]/50 hover:text-[#6B21E8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Cohort wall */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((fellow) => (
              <motion.button
                key={fellow.name}
                layout
                layoutId={`fellow-${fellow.name}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, ease: EASE }}
                onClick={() => setSelected(fellow)}
                className="group text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#1A1A1A]/8 bg-white">
                  <Portrait
                    fellow={fellow}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  {/* Story layer — their "why I joined", revealed on hover */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {fellow.why && (
                      <p className="text-[11px] italic leading-relaxed text-white/90 opacity-0 transition-opacity delay-150 duration-300 line-clamp-5 group-hover:opacity-100">
                        &ldquo;{excerpt(fellow.why)}&rdquo;
                      </p>
                    )}
                    <p className="mt-2 text-[11px] font-medium text-white/70 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                      {fellow.track || fellow.profession}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-medium text-[#1A1A1A]">
                  {fellow.name}
                </p>
                <p className="mt-0.5 text-center text-xs text-[#6B7280]">
                  {fellow.country}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fellow story overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-8"
          >
            <motion.div
              layoutId={`fellow-${selected.name}`}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-[2fr_3fr] md:overflow-hidden"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-[#6B21E8]"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Portrait */}
              <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[560px]">
                <Portrait fellow={selected} sizes="(max-width: 768px) 100vw, 40vw" />
              </div>

              {/* Story */}
              <div className="max-h-full overflow-y-auto p-7 sm:p-9">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                >
                  <h3 className="font-display text-3xl uppercase tracking-tight text-[#1A1A1A]">
                    {selected.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {selected.code && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 py-1 pl-1 pr-3 text-xs font-medium text-[#4B5563]">
                        <span className="relative h-5 w-5 overflow-hidden rounded-full">
                          <Image
                            src={`https://flagcdn.com/w80/${selected.code}.png`}
                            alt={`Flag of ${selected.country}`}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </span>
                        {selected.country}
                      </span>
                    )}
                    {selected.track && (
                      <span className="rounded-full bg-[#E9D5FF]/70 px-3 py-1 text-xs font-medium text-[#4C0F9E]">
                        {selected.track}
                      </span>
                    )}
                    {selected.profession && (
                      <span className="text-xs text-[#6B7280]">
                        {selected.profession}
                      </span>
                    )}
                  </div>

                  {selected.bio && (
                    <p className="mt-6 text-sm leading-relaxed text-[#4B5563]">
                      {selected.bio}
                    </p>
                  )}

                  {selected.why && (
                    <div className="mt-7 rounded-2xl bg-[#FAF9F5] p-5">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B21E8]">
                        <Quote className="h-3.5 w-3.5" /> Why I joined
                      </p>
                      <p className="mt-2.5 border-l-2 border-[#6B21E8] pl-4 text-sm italic leading-relaxed text-[#1A1A1A]/80">
                        {selected.why}
                      </p>
                    </div>
                  )}

                  {selected.hope && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B21E8]">
                        What I came to build
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#4B5563]">
                        {selected.hope}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
