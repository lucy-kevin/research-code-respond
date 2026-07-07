"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type ImpactContent = typeof SITE_CONTENT.impact;

/** Counts from 0 up to the number inside `value` (e.g. "200+") once visible. */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? parseInt(match[2], 10) : null;
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || target === null) return;
    const duration = 1500;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  if (target === null) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function Impact({
  content = SITE_CONTENT.impact,
}: {
  content?: ImpactContent;
}) {
  return (
    <section className="border-y border-[#1A1A1A]/8 bg-[#FAF9F5] px-6 py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 lg:grid-cols-4">
        {content.stats.map((stat, i) => (
          <motion.div
            key={`${stat.label}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className={`px-6 text-center lg:px-10 ${
              i > 0 ? "lg:border-l lg:border-[#1A1A1A]/10" : ""
            }`}
          >
            <p className="font-display text-5xl tracking-tight text-[#1A1A1A] sm:text-6xl">
              <CountUp value={stat.value} />
            </p>
            <p className="mt-3 text-sm text-[#6B7280]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
