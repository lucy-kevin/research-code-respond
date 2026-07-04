"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const CARDS = [
  {
    title: "Research & Development",
    desc: "We identify community needs, conduct rigorous studies, and develop ethical tech solutions.",
    photo: "/photos/card1.jpg",
    alwaysPhoto: true,
  },
  {
    title: "Education & Mentorship",
    desc: "We empower the next generation through hands-on training, bootcamps, and mentorship.",
    photo: "/photos/card2.jpg",
    alwaysPhoto: false,
  },
  {
    title: "Dissemination & Outreach",
    desc: "We share knowledge through publications, open-source contributions, and partnerships.",
    photo: "/photos/card3.jpg",
    alwaysPhoto: false,
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#6B21E8] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
            What we do
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#E9D5FF]">
            We support communities through research, education, and open
            technology — turning lived experience into lasting change.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            >
              <Link
                href="/pillars"
                className="group relative block h-[420px] overflow-hidden rounded-3xl bg-white/10"
              >
                {/* Photo layer — first card always shows it, others reveal on hover */}
                <Image
                  src={card.photo}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover transition-opacity duration-700 ${
                    card.alwaysPhoto
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-700 ${
                    card.alwaysPhoto
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Arrow chip */}
                <span className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-[#6B21E8]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>

                {/* Copy */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                  <h3 className="text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed transition-colors duration-500 ${
                      card.alwaysPhoto
                        ? "text-white/85"
                        : "text-[#E9D5FF] group-hover:text-white/85"
                    }`}
                  >
                    {card.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
