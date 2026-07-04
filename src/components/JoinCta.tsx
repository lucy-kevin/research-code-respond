"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function JoinCta() {
  return (
    <section className="bg-[#6B21E8] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl"
        >
          Join the 2026 cohort
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#E9D5FF]"
        >
          Twelve weeks, fully online, five specialist tracks — thirty of fifty
          seats reserved for women in tech. Applications for the current
          cohort are in review; write to us to hear about the next one.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/academy"
            className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#6B21E8] transition-colors duration-300 hover:bg-[#E9D5FF]"
          >
            Explore the Academy
          </a>
          <a
            href="mailto:info@researchcoderesolve.org"
            className="inline-flex items-center rounded-full border border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            Write to us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
