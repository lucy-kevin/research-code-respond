"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { label: "The Pillars", href: "/pillars" },
  { label: "Academy", href: "/academy" },
  { label: "Team", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Ecosystem", href: "#", hasFlyout: true },
];

const ECOSYSTEM_LINKS = [
  { label: "The Three Pillars", meta: "Research, education, outreach", href: "/pillars" },
  { label: "Academy — 2026 Bootcamp", meta: "12-week engineering intensive", href: "/academy" },
  { label: "Team & Values", meta: "Who we are and how we work", href: "/team" },
  { label: "Events", meta: "Hackathons, demo days, and workshops", href: "/events" },
  { label: "Partner with us", meta: "Four ways to support the work", href: "/partner" },
  { label: "Contact us", meta: "Project ideas, partnerships, programs", href: "/contact" },
];

export default function Navbar() {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      onMouseLeave={() => setFlyoutOpen(false)}
    >
      <nav className="bg-[#FAF9F5]/85 backdrop-blur-md border-b border-[#1A1A1A]/8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Research Code Respond — Innovation for Community Impact"
                width={387}
                height={319}
                priority
                className="h-14 w-auto"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-2 lg:flex">
              {NAV_LINKS.map((link) =>
                link.hasFlyout ? (
                  <button
                    key={link.label}
                    onMouseEnter={() => setFlyoutOpen(true)}
                    className={`rounded-full px-4 py-2 text-[15px] transition-colors duration-200 ${
                      flyoutOpen
                        ? "text-[#6B21E8]"
                        : "text-[#4B5563] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setFlyoutOpen(false)}
                    className="rounded-full px-4 py-2 text-[15px] text-[#4B5563] transition-colors duration-200 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div className="hidden items-center gap-6 lg:flex">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-[#1A1A1A] px-6 py-3 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-[#6B21E8]"
              >
                Contact us
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#4B5563] hover:text-[#1A1A1A] lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Ecosystem flyout */}
        <AnimatePresence>
          {flyoutOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="hidden overflow-hidden border-t border-[#1A1A1A]/8 bg-[#FAF9F5] lg:block"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 py-12 lg:px-8">
                {/* Left: studio statement */}
                <div className="flex flex-col justify-between border-r border-[#1A1A1A]/8 pr-12">
                  <p className="max-w-md text-2xl font-medium leading-snug tracking-tight text-[#1A1A1A]">
                    Shifting technology from black boxes to local, open-source
                    systems.
                  </p>
                  <p className="mt-8 text-sm text-[#6B7280]">
                    Kampala, Uganda — working across East and West Africa.
                  </p>
                </div>

                {/* Right: vertical link list */}
                <div className="flex flex-col">
                  {ECOSYSTEM_LINKS.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.08 + i * 0.05, ease: EASE }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setFlyoutOpen(false)}
                        className="group flex items-center justify-between border-b border-[#1A1A1A]/8 py-4"
                      >
                        <div>
                          <span className="block text-[15px] text-[#1A1A1A] transition-colors group-hover:text-[#6B21E8]">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-[#6B7280]">
                            {item.meta}
                          </span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#6B7280] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#6B21E8]" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden border-t border-[#1A1A1A]/8 bg-[#FAF9F5] lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {[
                  { label: "Home", href: "/" },
                  { label: "The Pillars", href: "/pillars" },
                  { label: "Academy", href: "/academy" },
                  { label: "Team", href: "/team" },
                  { label: "Events", href: "/events" },
                  { label: "Blog", href: "/blog" },
                  { label: "Partner with us", href: "/partner" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-[15px] text-[#4B5563] transition-colors hover:bg-[#E9D5FF]/40 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
