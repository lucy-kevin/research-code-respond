"use client";

import { motion } from "framer-motion";
import {
  Search,
  ClipboardCheck,
  Users,
  Database,
  Code2,
  BarChart3,
  Layers,
  Compass,
  GitBranch,
  BookOpen,
  Landmark,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type PillarsContent = typeof SITE_CONTENT.pillars;

const RND_ICONS = [Search, ClipboardCheck, Users, Database, Code2, BarChart3];
const EDU_ICONS = [Layers, Compass, Users];
const OUTREACH_ICONS = [GitBranch, BookOpen, Landmark];

type Status = "completed" | "in-progress" | "pending";

function chain(count: number, index: number): number[] {
  const ids: number[] = [];
  if (index > 0) ids.push(index);
  if (index < count - 1) ids.push(index + 2);
  return ids;
}

export default function PillarOrbits({
  content = SITE_CONTENT.pillars,
}: {
  content?: PillarsContent;
}) {
  const rndStatuses: Status[] = [
    "completed",
    "completed",
    "completed",
    "in-progress",
    "pending",
    "pending",
  ];

  const orbits = [
    {
      badge: "Pillar 1",
      title: content.items[0]?.title ?? "Research & Development",
      summary: content.items[0]?.summary ?? "",
      data: content.rndSteps.map((step, i) => ({
        id: i + 1,
        title: step.label,
        date: `Stage 0${i + 1}`,
        content: step.desc,
        category: "Research",
        icon: RND_ICONS[i % RND_ICONS.length],
        relatedIds: chain(content.rndSteps.length, i),
        status: rndStatuses[i % rndStatuses.length],
        energy: Math.max(15, 100 - i * 17),
      })),
    },
    {
      badge: "Pillar 2",
      title: content.items[1]?.title ?? "Education & Mentorship",
      summary: content.items[1]?.summary ?? "",
      data: content.eduItems.map((item, i) => ({
        id: i + 1,
        title: item.title,
        date: `Track 0${i + 1}`,
        content: item.desc,
        category: "Education",
        icon: EDU_ICONS[i % EDU_ICONS.length],
        relatedIds: chain(content.eduItems.length, i),
        status: "in-progress" as Status,
        energy: 80 - i * 15,
      })),
    },
    {
      badge: "Pillar 3",
      title: content.items[2]?.title ?? "Dissemination & Outreach",
      summary: content.items[2]?.summary ?? "",
      data: content.outreachItems.map((item, i) => ({
        id: i + 1,
        title: item.title,
        date: `Vector 0${i + 1}`,
        content: item.desc,
        category: "Outreach",
        icon: OUTREACH_ICONS[i % OUTREACH_ICONS.length],
        relatedIds: chain(content.outreachItems.length, i),
        status: "in-progress" as Status,
        energy: 70 - i * 15,
      })),
    },
  ];

  return (
    <section id="pillars" className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
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

        <div className="space-y-16">
          {orbits.map((orbit, i) => (
            <motion.div
              key={orbit.badge}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
            >
              <p className="mb-5 max-w-xl text-sm leading-relaxed text-[#6B7280]">
                {orbit.summary}
              </p>
              <RadialOrbitalTimeline
                timelineData={orbit.data}
                badge={orbit.badge}
                title={orbit.title}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
