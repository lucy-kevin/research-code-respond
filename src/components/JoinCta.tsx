"use client";

import { motion } from "framer-motion";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type JoinCtaContent = typeof SITE_CONTENT.joinCta;

export default function JoinCta({
  content = SITE_CONTENT.joinCta,
}: {
  content?: JoinCtaContent;
}) {
  return (
    <section className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-3xl bg-[#6B21E8] p-9 sm:p-14 md:grid-cols-[1.4fr_1fr]"
      >
        {/* Copy */}
        <div>
          <h2 className="font-display text-4xl uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            {content.heading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#E9D5FF]">
            {content.body}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={content.primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#6B21E8] transition-colors duration-300 hover:bg-[#E9D5FF]"
            >
              {content.primaryLabel}
            </a>
            <a
              href={content.secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              {content.secondaryLabel}
            </a>
          </div>
        </div>

        {/* Crosshair mark — echoes the page banners */}
        <div className="hidden justify-end md:flex">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            className="h-44 w-44 text-white/25 lg:h-56 lg:w-56"
            aria-hidden
          >
            <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="44" stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="8" x2="100" y2="192" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="100" x2="192" y2="100" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
