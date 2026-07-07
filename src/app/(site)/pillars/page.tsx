import type { Metadata } from "next";
import PillarOrbits from "@/components/PillarOrbits";
import PageBanner from "@/components/PageBanner";
import JoinCta from "@/components/JoinCta";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Pillars — Research Code Respond",
  description:
    "Research & Development, Education & Mentorship, and Dissemination & Outreach — the three structures every RCR project passes through.",
};

export default async function PillarsPage() {
  const content = await getSiteContent();

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="How we work"
        title="The Pillars"
        description={content.pillars.subheading}
        media={{ image: "/photos/card3.jpg" }}
        variant="grape"
      />
      <PillarOrbits content={content.pillars} />
      <JoinCta content={content.joinCta} />
    </main>
  );
}
