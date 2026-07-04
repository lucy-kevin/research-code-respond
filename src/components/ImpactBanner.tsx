"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINES = [
  { text: "Community research.", outline: false },
  { text: "Open technology.", outline: false },
  { text: "Local impact.", outline: true },
];

export default function ImpactBanner() {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden">
      <Image
        src="/photos/hero.jpg"
        alt="Fellows collaborating around laptops"
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Purple grade over the photography */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#4C0F9E]/90 via-[#4C0F9E]/35 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-40 text-center lg:px-8">
        {LINES.map((line, i) => (
          <motion.p
            key={line.text}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
            className={`font-display text-5xl uppercase leading-[1.05] tracking-tight sm:text-7xl ${
              line.outline ? "text-outline-white" : "text-white"
            }`}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
