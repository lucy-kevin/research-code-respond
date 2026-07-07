"use client";

import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

type PartnershipContent = typeof SITE_CONTENT.partnership;

export default function Partnership({
  content = SITE_CONTENT.partnership,
}: {
  content?: PartnershipContent;
}) {
  return (
    <section id="connect" className="relative overflow-hidden bg-[#FAF9F5] px-6 py-28 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-sm font-medium tracking-wide text-[#6B21E8]">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-tight text-[#1A1A1A] sm:text-5xl">
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            {content.subheading}
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {content.tiers.map((tier, i) => (
            <motion.div
              key={`${tier.name}-${i}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-500 ${
                tier.popular
                  ? "border-[#6B21E8] bg-[#E9D5FF]/30 shadow-[0_12px_36px_rgba(26,26,26,0.1)]"
                  : "border-[#1A1A1A]/10 bg-white hover:border-[#6B21E8]/40"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center whitespace-nowrap rounded-full bg-[#6B21E8] px-4 py-1.5 text-xs font-medium text-[#E9D5FF]">
                  Most popular
                </span>
              )}

              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm tracking-[0.15em] text-[#1A1A1A]">
                  {tier.name.toUpperCase()}
                </h3>
                <span className="font-mono text-[10px] text-[#6B7280]">
                  {tier.code}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className={`text-4xl font-medium tracking-tight ${
                    tier.popular ? "text-[#6B21E8]" : "text-[#1A1A1A]"
                  }`}
                >
                  {tier.amount}
                </span>
                <span className="font-mono text-xs text-[#6B7280]">
                  {tier.cadence}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                {tier.desc}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {tier.features.map((feature, j) => (
                  <li key={`${feature}-${j}`} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        tier.popular ? "text-[#6B21E8]" : "text-[#6B7280]"
                      }`}
                      strokeWidth={2.5}
                    />
                    <span className="text-[13px] leading-relaxed text-[#4B5563]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:info@researchcoderesolve.org"
                className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium transition-all duration-300 ${
                  tier.popular
                    ? "bg-[#6B21E8] text-white hover:bg-[#4C0F9E]"
                    : "border border-[#1A1A1A]/15 text-[#1A1A1A] hover:border-[#6B21E8] hover:text-[#6B21E8]"
                }`}
              >
                Become a Partner
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Emotional callout */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mx-auto mt-14 max-w-2xl text-center text-base leading-relaxed text-[#6B7280]"
        >
          {content.callout}
        </motion.p>
      </div>
    </section>
  );
}
