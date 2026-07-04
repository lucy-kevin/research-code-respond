import type { Metadata } from "next";
import Partnership from "@/components/Partnership";

export const metadata: Metadata = {
  title: "Partner with us — Research Code Respond",
  description:
    "Four partnership tiers, plus in-kind support: mentorship time, software licences, and cloud credits are equally welcome.",
};

export default function PartnerPage() {
  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <Partnership />
    </main>
  );
}
