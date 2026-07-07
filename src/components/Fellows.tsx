"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FELLOWS, type Fellow } from "@/data/fellows";
import { countriesOf } from "@/lib/countries";
import { SITE_CONTENT } from "@/data/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;

function excerpt(text: string, max = 200) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export default function Fellows({
  fellows = FELLOWS,
  content = SITE_CONTENT.fellowsSection,
}: {
  fellows?: Fellow[];
  content?: typeof SITE_CONTENT.fellowsSection;
}) {
  const featured = fellows.filter((f) => f.featured && f.photo);
  const countries = countriesOf(fellows);
  const subheading = content.subheadingTemplate
    .replace("{count}", String(fellows.length))
    .replace("{countries}", String(countries.length));

  return (
    <section className="bg-[#FAF9F5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-5xl uppercase tracking-tight text-[#1A1A1A] sm:text-6xl">
            {content.headingPrefix}{" "}
            <span className="text-[#6B21E8]">{content.headingAccent}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            {subheading}
          </p>
        </motion.div>

        {/* Expanding capsule strip of participant portraits */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="mt-14 overflow-x-auto pb-4"
        >
          <div className="flex h-80 min-w-[880px] gap-3 sm:h-96">
            {featured.map((fellow) => (
              <Link
                key={fellow.name}
                href="/academy#fellows"
                className="group relative flex-1 cursor-pointer overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-out hover:flex-[3.8]"
              >
                {fellow.photo && (
                  <Image
                    src={fellow.photo}
                    alt={fellow.name}
                    fill
                    sizes="400px"
                    className="object-cover object-top"
                  />
                )}
                {/* Story layer — their "why I joined", revealed on hover */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <p className="min-w-56 text-xs italic leading-relaxed text-white/90 opacity-0 transition-opacity delay-200 duration-300 line-clamp-5 group-hover:opacity-100">
                    &ldquo;{excerpt(fellow.why, 150)}&rdquo;
                  </p>
                  <p className="mt-3 min-w-56 opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
                    <span className="block text-sm font-semibold text-white">
                      {fellow.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-white/70">
                      {fellow.track || fellow.country}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Countries, shown as a compact flag chip row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="mt-14 flex flex-col items-center gap-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {countries.map((country) => (
              <span
                key={country.code}
                title={`${country.fellows} ${country.fellows === 1 ? "fellow" : "fellows"}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white py-1.5 pl-1.5 pr-3 transition-colors duration-300 hover:border-[#6B21E8]/50"
              >
                <span className="relative h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={`https://flagcdn.com/w80/${country.code}.png`}
                    alt={`Flag of ${country.name}`}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </span>
                <span className="text-xs font-medium text-[#4B5563]">
                  {country.name}
                </span>
              </span>
            ))}
          </div>
          <Link
            href="/academy#fellows"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B21E8] transition-colors hover:text-[#4C0F9E]"
          >
            {content.linkLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
