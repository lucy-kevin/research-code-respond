import type { Metadata } from "next";
import Partnership from "@/components/Partnership";
import Partners from "@/components/Partners";
import PageBanner from "@/components/PageBanner";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Partner with us — Research Code Respond",
  description:
    "Four partnership tiers, plus in-kind support: mentorship time, software licences, and cloud credits are equally welcome.",
};

export default async function PartnerPage() {
  const content = await getSiteContent();

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="Support the work"
        title="Partner with us"
        description={content.partnership.subheading}
        media={{ image: "/photos/card2.jpg" }}
        variant="grape"
      />
      <Partnership content={content.partnership} />
      <Partners content={content.partners} />
    </main>
  );
}
