"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  Users,
  ShieldCheck,
  Zap,
  BookOpenCheck,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type ValueCell = {
  kind: "value";
  code: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  span: string;
};

type TeamCell = {
  kind: "team";
  name: string;
  role: string;
  initials: string;
  span: string;
};

/* Asymmetric 4-column bento: values interleaved with team bios */
const CELLS: (ValueCell | TeamCell)[] = [
  {
    kind: "value",
    code: "V.01",
    title: "Build on Proof",
    desc: "No system ships on assumption. Feasibility studies, validated datasets, and measured impact precede every line of production code.",
    icon: FlaskConical,
    span: "md:col-span-2",
  },
  {
    kind: "team",
    name: "Julian Zaabu Kayikayi",
    role: "Co-Founder — Research Lead",
    initials: "JK",
    span: "md:col-span-1",
  },
  {
    kind: "value",
    code: "V.02",
    title: "Build with Community",
    desc: "The people a system serves are its first reviewers, not its last.",
    icon: Users,
    span: "md:col-span-1",
  },
  {
    kind: "team",
    name: "Kevin Ziyada Aseru",
    role: "Co-Founder — Engineering",
    initials: "KA",
    span: "md:col-span-1",
  },
  {
    kind: "value",
    code: "V.03",
    title: "Build with Integrity",
    desc: "Ethical data practice, honest reporting of failures, transparent funding.",
    icon: ShieldCheck,
    span: "md:col-span-1",
  },
  {
    kind: "team",
    name: "Suzan Ayikoru",
    role: "Academy & Programs",
    initials: "SA",
    span: "md:col-span-1",
  },
  {
    kind: "value",
    code: "V.04",
    title: "Build to Empower",
    desc: "Every project transfers capability outward — skills, tools, and ownership stay local.",
    icon: Zap,
    span: "md:col-span-1",
  },
  {
    kind: "value",
    code: "V.05",
    title: "Build on Open Knowledge",
    desc: "Research, code, and datasets published in the open by default. Black boxes end here — knowledge compounds when it is shared, cited, forked, and improved by the region it serves.",
    icon: BookOpenCheck,
    span: "md:col-span-2",
  },
  {
    kind: "team",
    name: "Elizabeth Saidi",
    role: "Community & Outreach",
    initials: "ES",
    span: "md:col-span-2",
  },
];

export default function Team() {
  return (
    <section id="ecosystem" className="bg-[#FAF9F5] px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-sm font-medium tracking-wide text-[#6B21E8]">
            Team &amp; Values
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-5xl">
            The people, and what they refuse to compromise.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            Five structural values, four humans in Kampala holding the studio
            to them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-[#1A1A1A]/10 md:grid-cols-4">
          {CELLS.map((cell, i) => (
            <motion.div
              key={cell.kind === "value" ? cell.code : cell.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: EASE }}
              whileHover={{ scale: 1.015 }}
              className={`group relative bg-white p-7 transition-shadow duration-500 hover:z-10 hover:shadow-[0_0_0_1px_#6B21E8,0_8px_24px_rgba(26,26,26,0.08)] lg:p-8 ${cell.span}`}
            >
              {cell.kind === "value" ? (
                <ValueCard cell={cell} />
              ) : (
                <TeamCard cell={cell} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ cell }: { cell: ValueCell }) {
  const Icon = cell.icon;
  return (
    <div className="flex h-full min-h-[180px] flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#6B7280] transition-colors duration-300 group-hover:text-[#6B21E8]">
          {cell.code}
        </span>
        <Icon
          className="h-4 w-4 text-[#6B7280] transition-colors duration-300 group-hover:text-[#6B21E8]"
          strokeWidth={1.75}
        />
      </div>
      <h3 className="mt-6 font-mono text-base text-[#1A1A1A]">{cell.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-[#6B7280]">
        {cell.desc}
      </p>
    </div>
  );
}

function TeamCard({ cell }: { cell: TeamCell }) {
  return (
    <div className="flex h-full min-h-[180px] flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#6B7280] transition-colors duration-300 group-hover:text-[#6B21E8]">
          TEAM
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#1A1A1A]/20 transition-colors duration-300 group-hover:bg-[#6B21E8]" />
      </div>
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-[#E9D5FF]/50 text-sm font-medium text-[#4C0F9E] transition-colors duration-500 group-hover:border-[#6B21E8]">
          {cell.initials}
        </div>
        <h3 className="mt-5 text-base font-medium text-[#1A1A1A]">{cell.name}</h3>
        <p className="mt-1 font-mono text-[12px] text-[#6B7280]">
          {cell.role}
        </p>
      </div>
    </div>
  );
}
