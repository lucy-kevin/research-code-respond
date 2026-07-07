"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Users,
  ShieldCheck,
  Zap,
  BookOpenCheck,
  type LucideIcon,
} from "lucide-react";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type TeamContent = typeof SITE_CONTENT.team;

const VALUE_ICONS: LucideIcon[] = [
  FlaskConical,
  Users,
  ShieldCheck,
  Zap,
  BookOpenCheck,
];

export default function Team({
  content = SITE_CONTENT.team,
}: {
  content?: TeamContent;
}) {
  return (
    <section id="ecosystem" className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14 max-w-2xl"
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

        {/* ── Mission & vision ── */}
        <div className="mb-16 grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl bg-[#6B21E8] p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E9D5FF]">
              Mission
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white">
              {content.mission}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B21E8]">
              Vision
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#1A1A1A]">
              {content.vision}
            </p>
          </motion.div>
        </div>

        {/* ── The team ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]"
        >
          {content.membersLabel}
        </motion.p>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {content.members.map((member, i) => (
            <motion.figure
              key={`${member.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: EASE }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#1A1A1A]/8 bg-white">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6B21E8] to-[#4C0F9E]">
                    <span className="font-display text-4xl text-white/90">
                      {member.initials}
                    </span>
                  </div>
                )}
              </div>
              <figcaption className="mt-4">
                <p className="text-base font-medium text-[#1A1A1A]">
                  {member.name}
                </p>
                <p className="mt-0.5 text-sm text-[#6B7280]">{member.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* ── Values ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]"
        >
          {content.valuesLabel}
        </motion.p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.values.map((value, i) => {
            const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
            return (
              <motion.div
                key={`${value.code}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
                className="group relative flex min-h-[220px] flex-col rounded-2xl bg-[#4C0F9E] p-7 transition-[transform,background-color] duration-300 ease-out hover:scale-[1.03] hover:bg-[#6B21E8]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C084FC]">
                  {value.code}
                </p>
                <h3 className="mt-5 text-xl font-semibold leading-snug text-white">
                  {value.title}
                </h3>
                <p className="mt-3 flex-1 pr-10 text-sm leading-relaxed text-[#E9D5FF]/85">
                  {value.desc}
                </p>

                {/* Notched corner with the value's icon, problem-card style */}
                <span
                  aria-hidden
                  className="absolute bottom-0 right-0 flex h-15 w-16 items-end justify-end rounded-tl-2xl bg-[#FAF9F5] pl-1.5 pt-1.5 transition-colors duration-300 ease-out group-hover:bg-transparent"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B21E8] text-white transition-colors duration-300 ease-out group-hover:bg-[#0A0A0A]">
                    <Icon
                      className="h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
