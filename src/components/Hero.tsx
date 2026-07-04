"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const MASK_STYLE: React.CSSProperties = {
  backgroundImage: "url(/photos/band.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center 30%",
};

export default function Hero() {
  return (
    <section className="bg-[#FAF9F5] px-6 pb-24 pt-36 sm:pt-44 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-sm tracking-wide text-[#6B7280]"
        >
          Kampala, Uganda · Innovation for Community Impact
        </motion.p>

        {/* Poster type with photography masked inside the letterforms */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          className="mt-10 font-display uppercase leading-[0.92] tracking-tight"
        >
          <span
            className="block bg-clip-text text-transparent text-[18vw] sm:text-[13vw] lg:text-[150px]"
            style={MASK_STYLE}
          >
            Research
          </span>
          <span
            className="block bg-clip-text text-transparent text-[18vw] sm:text-[13vw] lg:text-[150px]"
            style={{ ...MASK_STYLE, backgroundPosition: "center 55%" }}
          >
            Code
          </span>
          <span
            className="block bg-clip-text text-transparent text-[18vw] sm:text-[13vw] lg:text-[150px]"
            style={{ ...MASK_STYLE, backgroundPosition: "center 80%" }}
          >
            Respond
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
          className="mt-10 max-w-2xl text-lg leading-relaxed text-[#4B5563]"
        >
          We combine rigorous social research with innovative technology to
          tackle Uganda&apos;s most pressing community challenges through
          ethical, data-driven digital solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="/partner"
            className="inline-flex items-center rounded-full bg-[#6B21E8] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#4C0F9E]"
          >
            Partner with us
          </a>
          <a
            href="/pillars"
            className="inline-flex items-center rounded-full border border-[#1A1A1A]/25 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] transition-colors duration-300 hover:border-[#6B21E8] hover:text-[#6B21E8]"
          >
            Our approach
          </a>
        </motion.div>
      </div>
    </section>
  );
}
