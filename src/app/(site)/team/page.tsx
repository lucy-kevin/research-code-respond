import type { Metadata } from "next";
import Team from "@/components/Team";
import PageBanner from "@/components/PageBanner";
import JoinCta from "@/components/JoinCta";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Team & Values — Research Code Respond",
  description:
    "The people behind the studio and the five values they hold every project to.",
};

export default async function TeamPage() {
  const content = await getSiteContent();

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="Who we are"
        title="Team & Values"
        description={content.team.subheading}
        media={{
          video: "/videos/cofounders.mp4",
          poster: "/videos/cofounders-poster.jpg",
        }}
        variant="plum"
      />
      <Team content={content.team} />
      <JoinCta content={content.joinCta} />
    </main>
  );
}
