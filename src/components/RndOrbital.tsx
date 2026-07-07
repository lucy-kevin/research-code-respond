"use client";

import {
  Search,
  ClipboardCheck,
  Users,
  Database,
  Code2,
  BarChart3,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

/* The six R&D pipeline stages as orbital timeline nodes */
const RND_TIMELINE = [
  {
    id: 1,
    title: "Problem Identification",
    date: "Stage 01",
    content:
      "Field immersion with communities to surface real, lived constraints — not assumed ones.",
    category: "Research",
    icon: Search,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Feasibility Studies",
    date: "Stage 02",
    content:
      "Technical, economic, and infrastructural viability mapped against local conditions.",
    category: "Research",
    icon: ClipboardCheck,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Community Validation",
    date: "Stage 03",
    content:
      "Prototypes stress-tested by the people the system is built to serve.",
    category: "Validation",
    icon: Users,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 75,
  },
  {
    id: 4,
    title: "Dataset Creation",
    date: "Stage 04",
    content:
      "Local, representative, ethically-sourced datasets built where none existed.",
    category: "Data",
    icon: Database,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 5,
    title: "Solution Development",
    date: "Stage 05",
    content:
      "Open, maintainable engineering shipped with the community, not to it.",
    category: "Engineering",
    icon: Code2,
    relatedIds: [4, 6],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 6,
    title: "Impact Assessment",
    date: "Stage 06",
    content:
      "Longitudinal measurement of outcomes fed back into the research loop.",
    category: "Evaluation",
    icon: BarChart3,
    relatedIds: [5, 1],
    status: "pending" as const,
    energy: 15,
  },
];

export default function RndOrbital() {
  return (
    <section className="bg-[#FAF9F5] px-6 pb-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl uppercase tracking-tight text-[#1A1A1A] sm:text-4xl">
            The pipeline, live
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
            Every research project moves through the same six stages. Click a
            node to see where the current cycle stands — connected stages light
            up as you explore.
          </p>
        </div>
        <RadialOrbitalTimeline timelineData={RND_TIMELINE} />
      </div>
    </section>
  );
}
