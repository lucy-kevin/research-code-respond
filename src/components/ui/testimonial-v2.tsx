"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "For years we described our water access problem to NGOs and nothing changed. RCR sat in Nakawa with us for three weeks before writing any code. The monitoring dashboard they built runs on data our own committee collects.",
    name: "Florence Nsubuga",
    role: "Community Health Coordinator — Nakawa Division",
  },
  {
    quote:
      "The open-source validation dataset RCR published for West African crop imagery is the first one I could actually audit line by line. We forked it in Accra within a week and contributed 4,000 labelled samples back.",
    name: "Emmanuel Osei",
    role: "Agritech Researcher — Accra, Ghana",
  },
  {
    quote:
      "I joined the bootcamp as one of the women-in-tech cohort. Twelve weeks later I had shipped a real backend used by a district health office. Nobody handed me a certificate for watching videos — I built something my community touches.",
    name: "Amina Nafuna",
    role: "Backend Engineering Track — Cohort 2026",
  },
  {
    quote:
      "Their feasibility study told us honestly that our first idea would fail on infrastructure grounds. That honesty saved us a year. The redesigned system has run offline-first through every network outage since.",
    name: "David Okello",
    role: "Cooperative Director — Gulu",
  },
  {
    quote:
      "Most research about our markets is written in journals we never see. RCR published theirs open, in plain language, and came back to present the findings to the vendors who were the subjects of the study.",
    name: "Grace Atim",
    role: "Market Vendors Association — Kampala",
  },
  {
    quote:
      "We licensed nothing, we owed nothing. The tooling RCR released for local-language transcription is Apache-licensed and our Nairobi team now maintains two of its modules upstream.",
    name: "Brian Kiptoo",
    role: "Speech Systems Engineer — Nairobi, Kenya",
  },
  {
    quote:
      "As a policy advisor I have read a hundred tech whitepapers written for donors. RCR's data sovereignty briefs are the first written for us — grounded in Ugandan infrastructure realities, with the datasets attached.",
    name: "Sarah Mwangi",
    role: "Digital Policy Advisor — East African Community",
  },
  {
    quote:
      "The mentorship protocol is real. My mentor reviewed my pull requests every week for twelve weeks and then referred me into my first engineering role. The 1:4 ratio is not marketing — I counted.",
    name: "Peter Ssemwanga",
    role: "Frontend Track Graduate — Cohort 2026",
  },
  {
    quote:
      "Community validation sounded like a buzzword until they ran it on our clinic queueing prototype. Patients rejected the first design in a day. The second one, shaped by that feedback, is still in use.",
    name: "Dr. Joan Akello",
    role: "Medical Officer — Mbale Regional Clinic",
  },
];

/* Split into three columns for the multi-column vertical marquee */
const COLUMNS: { items: Testimonial[]; duration: string; className?: string }[] = [
  { items: TESTIMONIALS.slice(0, 3), duration: "38s" },
  { items: TESTIMONIALS.slice(3, 6), duration: "50s", className: "hidden md:block" },
  { items: TESTIMONIALS.slice(6, 9), duration: "44s", className: "hidden lg:block" },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="group mb-5 rounded-2xl border border-[#1A1A1A]/10 bg-white p-6 shadow-[0_4px_16px_rgba(26,26,26,0.04)] transition-colors duration-500 hover:border-[#6B21E8]">
      <Quote
        className="h-4 w-4 text-[#C084FC] transition-colors duration-300 group-hover:text-[#6B21E8]"
        strokeWidth={1.75}
      />
      <blockquote className="mt-4 text-sm leading-relaxed text-[#4B5563]">
        {t.quote}
      </blockquote>
      <figcaption className="mt-5 border-t border-[#1A1A1A]/8 pt-4">
        <p className="font-mono text-[13px] text-[#1A1A1A]">{t.name}</p>
        <p className="mt-0.5 font-mono text-[11px] text-[#6B7280]">{t.role}</p>
      </figcaption>
    </figure>
  );
}

export default function TestimonialMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-sm font-medium tracking-wide text-[#6B21E8]">
            Community
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-5xl">
            Field reflections from the ecosystem.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
            Unfiltered signal from the communities, researchers, and graduates
            our systems are accountable to.
          </p>
        </motion.div>

        {/* Multi-column infinite vertical marquee */}
        <div className="relative h-[560px] overflow-hidden">
          {/* Top / bottom fade masks */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#FAF9F5] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#FAF9F5] to-transparent" />

          <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {COLUMNS.map((col, i) => (
              <div key={i} className={`marquee-column overflow-hidden ${col.className ?? ""}`}>
                <div
                  className="animate-marquee-vertical"
                  style={{ "--marquee-duration": col.duration } as React.CSSProperties}
                >
                  {/* Duplicated content for a seamless -50% loop */}
                  {[...col.items, ...col.items].map((t, j) => (
                    <TestimonialCard key={`${t.name}-${j}`} t={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
