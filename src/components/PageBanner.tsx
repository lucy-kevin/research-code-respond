"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Media =
  | { video: string; poster?: string; image?: never }
  | { image: string; video?: never; poster?: never };

/**
 * Per-page tonal variants, cohere.com-style: every page gets its own shade
 * of the brand purple plus its own geometric mark, so the site reads as one
 * family without every header looking identical.
 */
const VARIANTS = {
  grape: { bg: "#4C0F9E", accent: "#C084FC", motif: "crosshair" },
  violet: { bg: "#6B21E8", accent: "#E9D5FF", motif: "orbits" },
  plum: { bg: "#3B0764", accent: "#C084FC", motif: "rings" },
  ink: { bg: "#2E1065", accent: "#A78BFA", motif: "plus" },
} as const;

export type BannerVariant = keyof typeof VARIANTS;

function Motif({
  kind,
  className,
}: {
  kind: (typeof VARIANTS)[BannerVariant]["motif"];
  className: string;
}) {
  const reduce = useReducedMotion();

  if (kind === "orbits") {
    return (
      <svg viewBox="0 0 88 88" fill="none" className={className} aria-hidden>
        <circle cx="44" cy="44" r="34" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="44" cy="44" r="20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="44" cy="44" r="3" fill="currentColor" />
        {/* Satellite dot riding the outer ring */}
        <motion.g
          style={{ originX: "44px", originY: "44px" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        >
          <circle cx="44" cy="10" r="4" fill="currentColor" />
        </motion.g>
      </svg>
    );
  }

  if (kind === "rings") {
    return (
      <svg viewBox="0 0 88 88" fill="none" className={className} aria-hidden>
        <circle cx="44" cy="44" r="34" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="44" cy="44" r="23" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="44" cy="44" r="12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (kind === "plus") {
    return (
      <svg viewBox="0 0 88 88" fill="none" className={className} aria-hidden>
        <line x1="44" y1="14" x2="44" y2="74" stroke="currentColor" strokeWidth="1.5" />
        <line x1="14" y1="44" x2="74" y2="44" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3" fill="currentColor" />
        <circle cx="74" cy="14" r="3" fill="currentColor" />
        <circle cx="14" cy="74" r="3" fill="currentColor" />
        <circle cx="74" cy="74" r="3" fill="currentColor" />
      </svg>
    );
  }

  // crosshair
  return (
    <svg viewBox="0 0 88 88" fill="none" className={className} aria-hidden>
      <circle cx="44" cy="44" r="34" stroke="currentColor" strokeWidth="1.5" />
      <line x1="44" y1="4" x2="44" y2="84" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="44" x2="84" y2="44" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Dark editorial page header in the spirit of cohere.com/north, in RCR's
 * own palette: a deep-purple field the fixed navbar sits over, a geometric
 * mark, a small uppercase eyebrow, an oversized display heading, and a
 * framed media panel that starts small and expands as the page scrolls.
 */
export default function PageBanner({
  eyebrow,
  title,
  description,
  media,
  variant = "grape",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  media?: Media;
  variant?: BannerVariant;
}) {
  const ref = useRef<HTMLElement>(null);
  const { bg, accent, motif } = VARIANTS[variant];

  // Progress from "hero pinned at the top" through "hero scrolled away".
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The panel grows from a smaller framed card to full width early in the scroll.
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.84, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [32, 18]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: bg }}
    >
      {/* Faint vertical rules — a quiet, technical grid like the reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "88px 100%",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 lg:px-8">
        <div className="flex items-start gap-6 sm:gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="mt-2 hidden shrink-0 sm:block"
            style={{ color: accent }}
          >
            <Motif kind={motif} className="h-16 w-16 lg:h-[88px] lg:w-[88px]" />
          </motion.div>

          <div className="max-w-3xl">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: accent }}
              >
                {eyebrow}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="mt-5 font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {title}
            </motion.h1>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                className="mt-7 max-w-2xl text-base leading-relaxed text-[#E9D5FF] sm:text-lg"
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>

        {/* Framed media panel — starts small, expands on scroll */}
        {media && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{ scale, borderRadius: radius }}
            className="relative mt-14 origin-center overflow-hidden border border-white/15 bg-black/10 shadow-2xl"
          >
            <div className="relative aspect-[16/9]">
              {media.video ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={media.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={media.video} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={media.image!}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1152px"
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Foot spacing so the panel breathes before the next section */}
      <div className={media ? "h-16 sm:h-24" : "h-16 sm:h-20"} />
    </section>
  );
}
