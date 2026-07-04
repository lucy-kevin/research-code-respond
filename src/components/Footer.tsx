import Link from "next/link";

const PAGES = [
  { label: "The Pillars", href: "/pillars" },
  { label: "Academy", href: "/academy" },
  { label: "Team & Values", href: "/team" },
  { label: "Partner with us", href: "/partner" },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#4C0F9E] px-6 pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-white">
              Research <span className="text-[#C084FC]">|</span> Code{" "}
              <span className="text-[#C084FC]">|</span> Respond
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#E9D5FF]/80">
              We merge rigorous social research with innovative technology to
              tackle Uganda&apos;s most pressing community challenges.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white">
              Pages
            </p>
            <ul className="mt-4 space-y-2.5">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-sm text-[#E9D5FF]/80 transition-colors hover:text-white"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:info@researchcoderesolve.org"
                  className="text-sm text-[#E9D5FF]/80 transition-colors hover:text-white"
                >
                  info@researchcoderesolve.org
                </a>
              </li>
              <li className="text-sm text-[#E9D5FF]/80">Kampala, Uganda</li>
            </ul>
          </div>
        </div>

        {/* Giant watermark line */}
        <p
          aria-hidden
          className="mt-16 select-none whitespace-nowrap text-center font-display text-[9vw] uppercase leading-none tracking-tight text-white/10 lg:text-[110px]"
        >
          Research. Code. Respond.
        </p>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/15 py-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-[#E9D5FF]/70">
            © 2026 Research Code Respond. All rights reserved.
          </p>
          <p className="text-[13px] text-[#E9D5FF]/70">
            Innovation for Community Impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
