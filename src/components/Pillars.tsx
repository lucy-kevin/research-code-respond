"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  GraduationCap,
  Radio,
  Plus,
  GitBranch,
  Terminal,
  BookOpen,
  Landmark,
  Users,
  Layers,
  Compass,
} from "lucide-react";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type PillarsContent = typeof SITE_CONTENT.pillars;

const PILLAR_ICONS = [FlaskConical, GraduationCap, Radio];
const EDU_ICONS = [Layers, Compass, Users];
const OUTREACH_ICONS = [GitBranch, BookOpen, Landmark];

export default function Pillars({
  content = SITE_CONTENT.pillars,
}: {
  content?: PillarsContent;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="pillars" className="relative bg-[#FAF9F5] px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 max-w-2xl"
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

        {/* Expanding stack */}
        <div className="flex flex-col gap-4">
          {content.items.map((pillar, idx) => {
            const isOpen = openIdx === idx;
            const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
            return (
              <motion.div
                key={`${pillar.title}-${idx}`}
                layout
                transition={{ duration: 0.6, ease: EASE }}
                className={`overflow-hidden rounded-2xl border transition-colors duration-500 ${
                  isOpen
                    ? "border-[#6B21E8]/50 bg-white shadow-[0_8px_28px_rgba(26,26,26,0.06)]"
                    : "border-[#1A1A1A]/10 bg-white/60 hover:border-[#1A1A1A]/25"
                }`}
              >
                {/* Row header */}
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center gap-5 px-6 py-6 text-left sm:px-8"
                >
                  <span
                    className={`font-mono text-xs ${
                      isOpen ? "text-[#6B21E8]" : "text-[#6B7280]"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-500 ${
                      isOpen
                        ? "border-[#6B21E8]/50 bg-[#E9D5FF]/50 text-[#6B21E8]"
                        : "border-[#1A1A1A]/15 text-[#6B7280]"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium text-[#1A1A1A] sm:text-xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 hidden text-sm text-[#6B7280] sm:block">
                      {pillar.summary}
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={isOpen ? "text-[#6B21E8]" : "text-[#6B7280]"}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>

                {/* Expanded body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#1A1A1A]/8 px-6 py-10 sm:px-8">
                        {idx === 0 && <RndFlowTree content={content} />}
                        {idx === 1 && <EducationGrid content={content} />}
                        {idx === 2 && <OutreachGrid content={content} />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Pillar 1 — structured branching flow tree */
function RndFlowTree({ content }: { content: PillarsContent }) {
  return (
    <div className="relative">
      <p className="mb-8 text-sm text-[#6B7280]">{content.rndIntro}</p>
      <div className="grid gap-x-10 gap-y-0 lg:grid-cols-2">
        {content.rndSteps.map((step, i) => (
          <motion.div
            key={`${step.label}-${i}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            className="relative flex gap-5 pb-8 pl-2 last:pb-0 lg:pb-10"
          >
            {i < content.rndSteps.length - 1 && (
              <span
                className="absolute left-[21px] top-8 h-full w-px bg-gradient-to-b from-[#6B21E8]/50 to-[#1A1A1A]/8 lg:hidden"
                aria-hidden
              />
            )}
            <span
              className="absolute left-[21px] top-8 hidden h-[calc(100%-16px)] w-px bg-gradient-to-b from-[#6B21E8]/50 to-[#1A1A1A]/8 lg:block"
              aria-hidden
            />
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#6B21E8]/50 bg-white font-mono text-[10px] text-[#6B21E8]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-0.5">
              <h4 className="font-mono text-sm text-[#1A1A1A]">{step.label}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Pillar 2 — curriculum, training, mentorship */
function EducationGrid({ content }: { content: PillarsContent }) {
  return (
    <div>
      <p className="mb-8 text-sm text-[#6B7280]">{content.eduIntro}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {content.eduItems.map((item, i) => {
          const Icon = EDU_ICONS[i % EDU_ICONS.length];
          return (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="rounded-xl border border-[#1A1A1A]/10 bg-[#FAF9F5] p-6 transition-colors duration-300 hover:border-[#6B21E8]/40"
            >
              <Icon className="h-5 w-5 text-[#6B21E8]" strokeWidth={1.75} />
              <h4 className="mt-4 font-mono text-sm text-[#1A1A1A]">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* Pillar 3 — open source, publications, policy */
function OutreachGrid({ content }: { content: PillarsContent }) {
  return (
    <div>
      <p className="mb-8 text-sm text-[#6B7280]">{content.outreachIntro}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {content.outreachItems.map((item, i) => {
          const Icon = OUTREACH_ICONS[i % OUTREACH_ICONS.length];
          return (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="flex flex-col rounded-xl border border-[#1A1A1A]/10 bg-[#FAF9F5] p-6 transition-colors duration-300 hover:border-[#6B21E8]/40"
            >
              <Icon className="h-5 w-5 text-[#6B21E8]" strokeWidth={1.75} />
              <h4 className="mt-4 font-mono text-sm text-[#1A1A1A]">
                {item.title}
              </h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6B7280]">
                {item.desc}
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-3 py-2">
                <Terminal className="h-3 w-3 text-[#C084FC]" />
                <code className="font-mono text-[11px] text-[#C084FC]">
                  {item.tag}
                </code>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
