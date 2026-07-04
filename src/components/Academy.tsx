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

const EASE = [0.16, 1, 0.3, 1] as const;

const METRICS = [
  { value: "12", unit: "WKS", label: "Bootcamp Duration", sub: "Fully online, starts June 1, 2026" },
  { value: "30", unit: "/50", label: "Spots for Women in Tech", sub: "60% of the cohort, reserved by design" },
  { value: "05", unit: "TRK", label: "Specialist Tracks", sub: "One learner, one deep vertical" },
];

const TRACKS = [
  { icon: PenTool, label: "Human-Centered Design" },
  { icon: BarChart3, label: "Data for Social Good" },
  { icon: Code2, label: "Frontend Web Development" },
  { icon: Smartphone, label: "Mobile Development" },
  { icon: Server, label: "Backend Engineering" },
];

export default function Academy() {
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
              Academy
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-5xl">
              Research Code Academy — Bootcamp 2026.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
              A twelve-week, fully online program launching June 1, 2026 —
              fifty seats, thirty of them reserved for women in tech, across
              five specialist tracks.
            </p>
          </div>
          <a
            href="#connect"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-[#6B21E8]"
          >
            Apply for 2026
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
                RCR.ACADEMY / COHORT-2026 / LIVE
              </span>
            </div>
            <span className="flex items-center gap-2 font-mono text-[10px] text-[#6B7280]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6B21E8]" />
              APPLICATIONS IN REVIEW
            </span>
          </div>

          {/* Metric cells */}
          <div className="grid divide-y divide-[#1A1A1A]/8 md:grid-cols-3 md:divide-x md:divide-y-0">
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
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
                WOMEN-IN-TECH ALLOCATION
              </span>
              <span className="text-[#6B21E8]">30 / 50 — 60%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1A1A1A]/8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
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
            {TRACKS.map((track, i) => {
              const Icon = track.icon;
              return (
                <motion.span
                  key={track.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E9D5FF]/60 px-4 py-2 text-[13px] font-medium text-[#4C0F9E] transition-colors duration-300 hover:bg-[#E9D5FF]"
                >
                  <Icon className="h-3.5 w-3.5 text-[#6B21E8]" strokeWidth={1.75} />
                  {track.label}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
