import Hero from "@/components/Hero";
import Impact from "@/components/Impact";
import WhatWeDo from "@/components/WhatWeDo";
import Problems from "@/components/Problems";
import Fellows from "@/components/Fellows";
import Partners from "@/components/Partners";
import JoinCta from "@/components/JoinCta";
import { getFellows, getSiteContent } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const [fellows, content] = await Promise.all([
    getFellows(),
    getSiteContent(),
  ]);

  return (
    <main className="bg-[#FAF9F5]">
      <Hero content={content.hero} />
      <Impact content={content.impact} />
      <WhatWeDo content={content.whatWeDo} />
      <Problems content={content.problems} />
      <Fellows fellows={fellows} content={content.fellowsSection} />
      <Partners content={content.partners} />
      <JoinCta content={content.joinCta} />
    </main>
  );
}
