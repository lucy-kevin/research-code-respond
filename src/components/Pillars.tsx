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

const EASE = [0.16, 1, 0.3, 1] as const;

const RND_STEPS = [
  { id: "01", label: "Problem Identification", desc: "Field immersion with communities to surface real, lived constraints — not assumed ones." },
  { id: "02", label: "Feasibility Studies", desc: "Technical, economic, and infrastructural viability mapped against local conditions." },
  { id: "03", label: "Community Validation", desc: "Prototypes stress-tested by the people the system is built to serve." },
  { id: "04", label: "Dataset Creation", desc: "Local, representative, ethically-sourced datasets built where none existed." },
  { id: "05", label: "Solution Development", desc: "Open, maintainable engineering shipped with the community, not to it." },
  { id: "06", label: "Impact Assessment", desc: "Longitudinal measurement of outcomes fed back into the research loop." },
];

const EDU_ITEMS = [
  {
    icon: Layers,
    title: "Curriculum Mechanics",
    desc: "Project-first modules sequenced from computational fundamentals through applied systems, tuned to regional industry demand.",
  },
  {
    icon: Compass,
    title: "Practical Training Frameworks",
    desc: "Every learner ships production artifacts: live repositories, deployed services, and datasets reviewed in the open.",
  },
  {
    icon: Users,
    title: "Structured Mentorship Protocols",
    desc: "1:4 mentor ratios, weekly technical reviews, and career pathing anchored by the 2026 Innovation Bootcamp cohort.",
  },
];

const OUTREACH_ITEMS = [
  {
    icon: GitBranch,
    title: "Open Source Pathways",
    desc: "Core studio infrastructure released under permissive licences with public roadmaps and contributor onboarding.",
    tag: "$ git clone rcr/core",
  },
  {
    icon: BookOpen,
    title: "Publications",
    desc: "Peer-reviewed research and accessible technical writing documenting methods, datasets, and failures honestly.",
    tag: "$ rcr publish --open",
  },
  {
    icon: Landmark,
    title: "Regional Policy Influence",
    desc: "Evidence briefs and advisory vectors shaping East African technology governance and data sovereignty law.",
    tag: "$ rcr policy --region=EA",
  },
];

const PILLARS = [
  {
    id: "p1",
    index: "01",
    icon: FlaskConical,
    title: "Research & Development",
    summary: "We identify community needs, conduct rigorous studies, and develop ethical tech solutions.",
  },
  {
    id: "p2",
    index: "02",
    icon: GraduationCap,
    title: "Education & Mentorship",
    summary: "We empower the next generation through hands-on training, bootcamps, and mentorship.",
  },
  {
    id: "p3",
    index: "03",
    icon: Radio,
    title: "Dissemination & Outreach",
    summary: "We share knowledge through publications, open-source contributions, and partnerships.",
  },
];

export default function Pillars() {
  const [openId, setOpenId] = useState<string | null>("p1");

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
            The Three Pillars
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-5xl">
            One studio. Three load-bearing structures.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            We merge rigorous social research with innovative technology to
            tackle Uganda&apos;s most pressing community challenges. Every
            project passes through the same three structures.
          </p>
        </motion.div>

        {/* Expanding stack */}
        <div className="flex flex-col gap-4">
          {PILLARS.map((pillar) => {
            const isOpen = openId === pillar.id;
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
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
                  onClick={() => setOpenId(isOpen ? null : pillar.id)}
                  className="flex w-full items-center gap-5 px-6 py-6 text-left sm:px-8"
                >
                  <span
                    className={`font-mono text-xs ${
                      isOpen ? "text-[#6B21E8]" : "text-[#6B7280]"
                    }`}
                  >
                    {pillar.index}
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
                        {pillar.id === "p1" && <RndFlowTree />}
                        {pillar.id === "p2" && <EducationGrid />}
                        {pillar.id === "p3" && <OutreachGrid />}
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

/* Pillar 1 — structured branching flow tree, 6 sequential steps */
function RndFlowTree() {
  return (
    <div className="relative">
      <p className="mb-8 text-sm text-[#6B7280]">
        Six stages, in sequence. Nothing skips a step.
      </p>
      <div className="grid gap-x-10 gap-y-0 lg:grid-cols-2">
        {RND_STEPS.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            className="relative flex gap-5 pb-8 pl-2 last:pb-0 lg:pb-10"
          >
            {/* Trunk line */}
            {i < RND_STEPS.length - 1 && (
              <span
                className="absolute left-[21px] top-8 h-full w-px bg-gradient-to-b from-[#6B21E8]/50 to-[#1A1A1A]/8 lg:hidden"
                aria-hidden
              />
            )}
            <span
              className="absolute left-[21px] top-8 hidden h-[calc(100%-16px)] w-px bg-gradient-to-b from-[#6B21E8]/50 to-[#1A1A1A]/8 lg:block"
              aria-hidden
            />
            {/* Node */}
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#6B21E8]/50 bg-white font-mono text-[10px] text-[#6B21E8]">
              {step.id}
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
function EducationGrid() {
  return (
    <div>
      <p className="mb-8 text-sm text-[#6B7280]">
        How we train, and how the 2026 Innovation Bootcamp is run.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {EDU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
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

/* Pillar 3 — open source, publications, policy with terminal tags */
function OutreachGrid() {
  return (
    <div>
      <p className="mb-8 text-sm text-[#6B7280]">
        How our work leaves the studio — open by default.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {OUTREACH_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
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
