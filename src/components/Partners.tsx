"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Partners() {
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
          We work alongside
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mt-10 grid grid-cols-1 items-center gap-10 sm:grid-cols-3 sm:gap-6"
        >
          {/* Vital Minds Initiative — typographic lockup until a logo file is provided */}
          <a
            href="#"
            aria-label="Vital Minds Initiative"
            className="flex items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100"
          >
            <span className="text-center">
              <span className="block text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                Vital Minds
              </span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.3em] text-[#6B7280]">
                Initiative
              </span>
            </span>
          </a>

          {/* SDC Startup School — white wordmark rendered dark via invert */}
          <a
            href="https://www.sdcstartupschool.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SDC Startup School"
            className="flex items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100"
          >
            <Image
              src="/partners/sdc.png"
              alt="SDC Startup School"
              width={220}
              height={68}
              className="h-12 w-auto object-contain invert sm:h-14"
            />
          </a>

          {/* The Amazon Leadership Initiative */}
          <a
            href="https://theali.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="The Amazon Leadership Initiative"
            className="flex items-center justify-center opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            <Image
              src="/partners/theali.png"
              alt="The Amazon Leadership Initiative"
              width={260}
              height={90}
              className="h-16 w-auto object-contain sm:h-20"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
