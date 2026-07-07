"use client";

import { motion } from "framer-motion";
import {
  PenTool,
  BarChart3,
  Code2,
  Smartphone,
  Server,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type AcademyContent = typeof SITE_CONTENT.academy;

const TRACK_ICONS = [PenTool, BarChart3, Code2, Smartphone, Server];

export default function Academy({
  content = SITE_CONTENT.academy,
}: {
  content?: AcademyContent;
}) {
  return (
    <section id="academy" className="relative overflow-hidden bg-[#FAF9F5] px-6 py-28 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide text-[#6B21E8]">
              {content.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-tight text-[#1A1A1A] sm:text-5xl">
              {content.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
              {content.subheading}
            </p>
          </div>
          <a
            href="/partner"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-[#6B21E8]"
          >
            {content.applyLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Dashboard frame */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-white shadow-[0_16px_48px_rgba(26,26,26,0.06)]"
        >
          {/* Dashboard toolbar */}
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/8 bg-[#E9D5FF]/30 px-6 py-3.5">
            <div className="flex items-center gap-3">
              <Activity className="h-3.5 w-3.5 text-[#6B21E8]" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#1A1A1A]">
                {content.toolbarText}
              </span>
            </div>
            <span className="flex items-center gap-2 font-mono text-[10px] text-[#6B7280]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6B21E8]" />
              {content.statusText}
            </span>
          </div>

          {/* Metric cells */}
          <div className="grid divide-y divide-[#1A1A1A]/8 md:grid-cols-3 md:divide-x md:divide-y-0">
            {content.metrics.map((metric, i) => (
              <motion.div
                key={`${metric.label}-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: EASE }}
                className="group p-8 transition-colors duration-500 hover:bg-[#E9D5FF]/20 lg:p-10"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-medium tracking-tight text-[#6B21E8] lg:text-7xl">
                    {metric.value}
                  </span>
                  <span className="font-mono text-lg text-[#6B7280]">
                    {metric.unit}
                  </span>
                </div>
                <p className="mt-4 font-mono text-sm text-[#1A1A1A]">
                  {metric.label}
                </p>
                <p className="mt-1.5 text-sm text-[#6B7280]">{metric.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Women-in-tech progress strip */}
          <div className="border-t border-[#1A1A1A]/8 px-8 py-6">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px]">
              <span className="tracking-[0.2em] text-[#6B7280]">
                {content.progressLabel}
              </span>
              <span className="text-[#6B21E8]">{content.progressText}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1A1A1A]/8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${content.progressPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
                className="h-full rounded-full bg-[#6B21E8]"
              />
            </div>
          </div>

          {/* Track pills */}
          <div className="flex flex-wrap items-center gap-3 border-t border-[#1A1A1A]/8 px-8 py-6">
            <span className="mr-2 font-mono text-[11px] tracking-[0.2em] text-[#6B7280]">
              TRACKS //
            </span>
            {content.tracks.map((track, i) => {
              const Icon = TRACK_ICONS[i % TRACK_ICONS.length];
              return (
                <motion.span
                  key={`${track}-${i}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E9D5FF]/60 px-4 py-2 text-[13px] font-medium text-[#4C0F9E] transition-colors duration-300 hover:bg-[#E9D5FF]"
                >
                  <Icon className="h-3.5 w-3.5 text-[#6B21E8]" strokeWidth={1.75} />
                  {track}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
