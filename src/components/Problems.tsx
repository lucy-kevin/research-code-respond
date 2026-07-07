"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type ProblemsContent = typeof SITE_CONTENT.problems;

export default function Problems({
  content = SITE_CONTENT.problems,
}: {
  content?: ProblemsContent;
}) {
  return (
    <section className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            {content.subheading}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            >
              <Link
                href="/academy"
                className="group relative flex h-full min-h-[260px] flex-col rounded-2xl bg-[#4C0F9E] p-7 transition-[transform,background-color] duration-300 ease-out hover:scale-[1.03] hover:bg-[#6B21E8]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C084FC]">
                  Problem 0{i + 1} — Cohort 2026
                </p>
                <h3 className="mt-5 text-xl font-semibold leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#E9D5FF]/85">
                  {item.desc}
                </p>
                <span className="mt-6 text-sm font-medium text-[#E9D5FF] transition-colors duration-300 group-hover:text-white">
                  Read more
                </span>

                {/* Notched corner: a cutout matching the section background
                    that heals into the card color on hover, so the card
                    becomes the arrow's background */}
                <span
                  aria-hidden
                  className="absolute bottom-0 right-0 flex h-15 w-16 items-end justify-end rounded-tl-2xl bg-[#FAF9F5] pl-1.5 pt-1.5 transition-colors duration-300 ease-out group-hover:bg-transparent"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B21E8] text-white transition-colors duration-300 ease-out group-hover:bg-[#0A0A0A]">
                    <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0" />
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
