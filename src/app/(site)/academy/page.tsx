import type { Metadata } from "next";
import Academy from "@/components/Academy";
import FellowsGrid from "@/components/FellowsGrid";
import FellowVoices from "@/components/FellowVoices";
import Problems from "@/components/Problems";
import PageBanner from "@/components/PageBanner";
import { getFellows, getSiteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Academy — Research Code Respond",
  description:
    "Research Code Academy Bootcamp 2026: a 12-week fully online program running June 1 to August 29, 2026, with 30 of 50 seats held by women in tech, across five specialist tracks.",
};

export default async function AcademyPage() {
  const [fellows, content] = await Promise.all([
    getFellows(),
    getSiteContent(),
  ]);

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="Bootcamp 2026"
        title="Academy"
        description={content.academy.subheading}
        media={{ image: "/photos/hero.jpg" }}
        variant="violet"
      />
      <Academy content={content.academy} />
      <Problems content={content.problems} />
      <FellowVoices fellows={fellows} content={content.trust} />
      <FellowsGrid fellows={fellows} />
    </main>
  );
}
