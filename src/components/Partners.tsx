"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type PartnersContent = typeof SITE_CONTENT.partners;

export default function Partners({
  content = SITE_CONTENT.partners,
}: {
  content?: PartnersContent;
}) {
  const cols =
    content.items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <section className="border-y border-[#1A1A1A]/8 bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center text-sm tracking-wide text-[#6B7280]"
        >
          {content.heading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className={`mt-10 grid grid-cols-1 items-center gap-10 sm:gap-6 ${cols}`}
        >
          {content.items.map((partner, i) => {
            const inner = partner.logoUrl ? (
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                width={260}
                height={90}
                className={`h-14 w-auto object-contain sm:h-16 ${
                  partner.invert ? "invert" : ""
                }`}
              />
            ) : (
              /* Typographic lockup until a logo file is provided */
              <span className="text-center">
                <span className="block text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                  {partner.name.split(" ").slice(0, -1).join(" ") || partner.name}
                </span>
                {partner.name.split(" ").length > 1 && (
                  <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.3em] text-[#6B7280]">
                    {partner.name.split(" ").slice(-1)[0]}
                  </span>
                )}
              </span>
            );

            return partner.url ? (
              <a
                key={`${partner.name}-${i}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.name}
                className="flex items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100"
              >
                {inner}
              </a>
            ) : (
              <span
                key={`${partner.name}-${i}`}
                aria-label={partner.name}
                className="flex items-center justify-center opacity-70"
              >
                {inner}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
