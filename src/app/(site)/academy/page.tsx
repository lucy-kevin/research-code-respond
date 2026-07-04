import type { Metadata } from "next";
import Academy from "@/components/Academy";
import FellowsGrid from "@/components/FellowsGrid";
import { getFellows } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Academy — Research Code Respond",
  description:
    "Research Code Academy Bootcamp 2026: a 12-week fully online program launching June 1, 2026, with 30 of 50 seats reserved for women in tech, across five specialist tracks.",
};

export default async function AcademyPage() {
  const fellows = await getFellows();

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <Academy />
      <FellowsGrid fellows={fellows} />
    </main>
  );
}
