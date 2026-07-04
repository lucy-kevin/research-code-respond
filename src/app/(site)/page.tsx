import Hero from "@/components/Hero";
import ImpactBanner from "@/components/ImpactBanner";
import Impact from "@/components/Impact";
import WhatWeDo from "@/components/WhatWeDo";
import Fellows from "@/components/Fellows";
import Partners from "@/components/Partners";
import JoinCta from "@/components/JoinCta";
import { getFellows } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const fellows = await getFellows();

  return (
    <main className="bg-[#FAF9F5]">
      <Hero />
      <ImpactBanner />
      <Impact />
      <WhatWeDo />
      <Fellows fellows={fellows} />
      <Partners />
      <JoinCta />
    </main>
  );
}
