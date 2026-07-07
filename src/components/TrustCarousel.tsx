"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FELLOWS, type Fellow } from "@/data/fellows";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type TrustContent = typeof SITE_CONTENT.trust;

export default function TrustCarousel({
  fellows = FELLOWS,
  content = SITE_CONTENT.trust,
}: {
  fellows?: Fellow[];
  content?: TrustContent;
}) {
  const slides = fellows.filter((f) => f.photo && f.why.length > 200);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (slides.length === 0) return null;
  const slide = slides[index % slides.length];

  function go(dir: number) {
    setDirection(dir);
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }

  return (
    <section className="overflow-hidden bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex items-end justify-between gap-6"
        >
          <h2 className="font-display text-4xl uppercase tracking-tight text-[#1A1A1A] sm:text-5xl">
            {content.heading}
          </h2>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1A1A1A]/15 text-[#4B5563] transition-colors hover:border-[#6B21E8] hover:text-[#6B21E8]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition-colors hover:bg-[#6B21E8]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Slide */}
        <div className="relative mt-10 min-h-[460px] sm:min-h-[420px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.name}
              initial={{ opacity: 0, x: 60 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 * direction }}
              transition={{ duration: 0.55, ease: EASE }}
              className="grid overflow-hidden rounded-3xl border border-[#1A1A1A]/10 bg-white md:grid-cols-[3fr_2fr]"
            >
              {/* Quote panel */}
              <div className="flex flex-col justify-between p-8 sm:p-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B21E8]">
                    {slide.track || "RCA Bootcamp 2026"}
                  </p>
                  <blockquote className="mt-6 text-xl leading-relaxed text-[#1A1A1A] sm:text-2xl">
                    &ldquo;{slide.why}&rdquo;
                  </blockquote>
                </div>
                <p className="mt-8 text-sm text-[#6B7280]">
                  — {slide.name}
                  {slide.profession ? `, ${slide.profession}` : ""}
                  {slide.country ? ` · ${slide.country}` : ""}
                </p>
              </div>

              {/* Photo panel */}
              <div className="relative min-h-[280px] md:min-h-[420px]">
                {slide.photo && (
                  <Image
                    src={slide.photo}
                    alt={slide.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-top"
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-8 flex max-w-md gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.name}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-[#1A1A1A]/10"
            >
              <span
                className={`block h-full rounded-full bg-[#6B21E8] transition-all duration-500 ${
                  i === index ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
