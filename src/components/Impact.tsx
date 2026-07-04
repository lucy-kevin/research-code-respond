"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { value: "5+", label: "Research studies annually" },
  { value: "5+", label: "Tech prototypes per cycle" },
  { value: "200+", label: "Youth trained" },
  { value: "8+", label: "Research outputs" },
];

export default function Impact() {
  return (
    <section className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-[#1A1A1A]/10 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="bg-white p-8 lg:p-10"
            >
              <p className="font-display text-4xl tracking-tight text-[#6B21E8] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm text-[#6B7280]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
