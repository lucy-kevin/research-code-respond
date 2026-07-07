"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import { FELLOWS, type Fellow } from "@/data/fellows";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type TrustContent = typeof SITE_CONTENT.trust;

function excerpt(text: string, max = 340) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/* Deterministic scramble so the rotation doesn't always lead with the
   alphabetically-first fellows (and server/client render identically). */
function nameHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export default function FellowVoices({
  fellows = FELLOWS,
  content = SITE_CONTENT.trust,
}: {
  fellows?: Fellow[];
  content?: TrustContent;
}) {
  const eligible = useMemo(
    () => fellows.filter((f) => f.photo && f.why.length > 200),
    [fellows]
  );

  // Server-render a stable order, then reshuffle randomly after mount
  // so every visit features different fellows in a different order.
  const [selection, setSelection] = useState<Fellow[]>(() =>
    [...eligible].sort((a, b) => nameHash(a.name) - nameHash(b.name)).slice(0, 6)
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const shuffled = [...eligible];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setSelection(shuffled.slice(0, 6));
    });
    return () => cancelAnimationFrame(raf);
  }, [eligible]);

  const testimonials = selection.map((f) => ({
    quote: excerpt(f.why),
    name: f.name,
    designation: [f.track || f.profession, f.country]
      .filter(Boolean)
      .join(" · "),
    src: f.photo!,
  }));

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display text-4xl uppercase tracking-tight text-[#1A1A1A] sm:text-5xl"
        >
          {content.heading}
        </motion.h2>

        <div className="mt-6 flex justify-center">
          <CircularTestimonials
            testimonials={testimonials}
            autoplay
            colors={{
              name: "#1A1A1A",
              designation: "#6B7280",
              testimony: "#4B5563",
              arrowBackground: "#1A1A1A",
              arrowForeground: "#ffffff",
              arrowHoverBackground: "#6B21E8",
            }}
            fontSizes={{
              name: "26px",
              designation: "15px",
              quote: "17px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
