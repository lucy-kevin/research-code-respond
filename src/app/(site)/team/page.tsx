import type { Metadata } from "next";
import Team from "@/components/Team";

export const metadata: Metadata = {
  title: "Team & Values — Research Code Respond",
  description:
    "The people behind the studio and the five values they hold every project to.",
};

export default function TeamPage() {
  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <Team />
    </main>
  );
}
