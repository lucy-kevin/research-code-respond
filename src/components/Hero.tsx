"use client";

import { motion } from "framer-motion";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroContent = typeof SITE_CONTENT.hero;

export default function Hero({
  content = SITE_CONTENT.hero,
}: {
  content?: HeroContent;
}) {
  /* backgroundAttachment: fixed pins the photo to the viewport, so the
     letterforms scroll over a stationary image like a window. */
  const mask: React.CSSProperties = {
    backgroundImage: `url(${content.imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <section className="bg-[#FAF9F5] px-6 pb-24 pt-36 sm:pt-44 lg:px-8">
      {/* No transforms on this wrapper: an ancestor transform disables
          background-attachment: fixed, which would unpin the photo. */}
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-sm tracking-wide text-[#6B7280]"
        >
          {content.eyebrow}
        </motion.p>

        {/* Poster type with photography masked inside the letterforms */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          className="mt-10 font-display uppercase leading-[0.92] tracking-tight"
        >
          {[content.line1, content.line2, content.line3]
            .filter(Boolean)
            .map((line) => (
              <span
                key={line}
                className="block bg-clip-text text-transparent text-[13vw] sm:text-[9vw] lg:text-[92px]"
                style={mask}
              >
                {line}
              </span>
            ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="mt-10 max-w-3xl text-xl font-medium leading-snug text-[#1A1A1A] sm:text-2xl"
        >
          {content.positioning}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-[#6B7280]"
        >
          {content.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={content.primaryHref}
            className="inline-flex items-center rounded-full bg-[#6B21E8] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#4C0F9E]"
          >
            {content.primaryLabel}
          </a>
          <a
            href={content.secondaryHref}
            className="inline-flex items-center rounded-full border border-[#1A1A1A]/25 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] transition-colors duration-300 hover:border-[#6B21E8] hover:text-[#6B21E8]"
          >
            {content.secondaryLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
