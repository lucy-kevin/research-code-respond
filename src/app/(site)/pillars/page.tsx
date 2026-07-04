import type { Metadata } from "next";
import Pillars from "@/components/Pillars";
import RndOrbital from "@/components/RndOrbital";

export const metadata: Metadata = {
  title: "The Pillars — Research Code Respond",
  description:
    "Research & Development, Education & Mentorship, and Dissemination & Outreach — the three structures every RCR project passes through.",
};

export default function PillarsPage() {
  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <Pillars />
      <RndOrbital />
    </main>
  );
}
