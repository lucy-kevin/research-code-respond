import type { Metadata } from "next";
import Events from "@/components/Events";
import PageBanner from "@/components/PageBanner";
import JoinCta from "@/components/JoinCta";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events — Research Code Respond",
  description:
    "Hackathons, demo days, research workshops, and community showcases from the Research Code Respond studio and the RCA Bootcamp.",
};

export default async function EventsPage() {
  const content = await getSiteContent();

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="Gatherings"
        title="Events"
        description={content.events.subheading}
        media={{ image: content.events.headerImageUrl }}
        variant="ink"
      />
      <Events content={content.events} />
      <JoinCta content={content.joinCta} />
    </main>
  );
}
