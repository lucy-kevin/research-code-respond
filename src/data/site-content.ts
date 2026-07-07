/**
 * Default site copy. Every section can be overridden from the admin
 * portal (/admin/content) — values saved there are stored in Supabase
 * and shallow-merged over these defaults, so anything not edited yet
 * falls back to what's written here.
 */

export const SITE_CONTENT = {
  hero: {
    eyebrow: "Kampala, Uganda · Innovation for Community Impact",
    line1: "Research",
    line2: "Code Resolve",
    line3: "",
    positioning:
      "A nonprofit research and technology studio in Kampala — building ethical digital solutions with the communities they serve.",
    subline:
      "We combine rigorous social research with innovative technology to tackle Uganda's most pressing community challenges through ethical, data-driven digital solutions.",
    primaryLabel: "Partner with us",
    primaryHref: "/partner",
    secondaryLabel: "Our approach",
    secondaryHref: "/pillars",
    imageUrl: "/photos/band.jpg",
  },

  banner: {
    imageUrl: "/photos/hero.jpg",
    line1: "Community research.",
    line2: "Open technology.",
    line3: "Local impact.",
  },

  impact: {
    stats: [
      { value: "5+", label: "Research studies annually" },
      { value: "5+", label: "Tech prototypes per cycle" },
      { value: "200+", label: "Youth trained" },
      { value: "8+", label: "Research outputs" },
    ],
  },

  whatWeDo: {
    heading: "What we do",
    subheading:
      "We support communities through research, education, and open technology — turning lived experience into lasting change.",
    cards: [
      {
        title: "Research & Development",
        desc: "We identify community needs, conduct rigorous studies, and develop ethical tech solutions.",
        photoUrl: "/photos/card1.jpg",
      },
      {
        title: "Education & Mentorship",
        desc: "We empower the next generation through hands-on training, bootcamps, and mentorship.",
        photoUrl: "/photos/card2.jpg",
      },
      {
        title: "Dissemination & Outreach",
        desc: "We share knowledge through publications, open-source contributions, and partnerships.",
        photoUrl: "/photos/card3.jpg",
      },
    ],
  },

  trust: {
    heading: "Why our community trusts RCR",
  },

  problems: {
    eyebrow: "On the workbench",
    heading: "Problems we're solving right now",
    subheading:
      "Every 2026 bootcamp team is paired with a real community problem, researched and validated before a line of code is written.",
    items: [
      {
        title: "Mobile money fraud",
        desc: "Mobile money fraud via WhatsApp account takeover — protecting users from social-engineering attacks on their wallets.",
      },
      {
        title: "SRHR access for young women",
        desc: "Inaccessible sexual and reproductive health services for adolescent girls and young women.",
      },
      {
        title: "Mental health first aid",
        desc: "Absence of culturally appropriate mental health first aid resources for African communities.",
      },
      {
        title: "Refugee language barriers",
        desc: "Language barriers preventing refugees from accessing essential services.",
      },
      {
        title: "GBV survivor safety",
        desc: "Gender-based violence survivors cannot locate safe shelters in real time.",
      },
      {
        title: "Youth service referrals",
        desc: "Lack of real-time referral coordination for vulnerable youth services.",
      },
    ],
  },

  fellowsSection: {
    headingPrefix: "Meet our",
    headingAccent: "fellows",
    subheadingTemplate:
      "{count} builders from {countries} countries in the 2026 cohort — hover to meet a few of them.",
    linkLabel: "Meet the full cohort",
  },

  partners: {
    heading: "We work alongside",
    items: [
      { name: "Vital Minds Initiative", url: "", logoUrl: "", invert: false },
      {
        name: "SDC Startup School",
        url: "https://www.sdcstartupschool.com/",
        logoUrl: "/partners/sdc.png",
        invert: true,
      },
      {
        name: "The Amazon Leadership Initiative",
        url: "https://theali.org/",
        logoUrl: "/partners/theali.png",
        invert: false,
      },
    ],
  },

  joinCta: {
    heading: "The 2026 cohort is in session",
    body: "Fifty-four fellows from fourteen countries are twelve weeks deep into research, design, and code — building solutions to six real community problems. Applications for the next cohort open soon; write to us to be first in line.",
    primaryLabel: "Meet the cohort",
    primaryHref: "/academy",
    secondaryLabel: "Write to us",
    secondaryHref: "/contact",
  },

  footer: {
    blurb:
      "We merge rigorous social research with innovative technology to tackle Uganda's most pressing community challenges.",
    email: "info@researchcoderesolve.org",
    location: "Kampala, Uganda",
    tagline: "Innovation for Community Impact.",
    watermark: "Research. Code. Respond.",
  },

  academy: {
    headerImageUrl: "/photos/hero.jpg",
    eyebrow: "Academy",
    heading: "Research Code Academy — Bootcamp 2026.",
    subheading:
      "A twelve-week, fully online program running June 1 to August 29, 2026 — fifty seats, thirty of them held by women in tech, across five specialist tracks.",
    applyLabel: "Meet the fellows",
    toolbarText: "RCR.ACADEMY / COHORT-2026 / LIVE",
    statusText: "COHORT IN SESSION",
    metrics: [
      { value: "12", unit: "WKS", label: "Bootcamp Duration", sub: "Fully online, June 1 – August 29, 2026" },
      { value: "30", unit: "/50", label: "Spots for Women in Tech", sub: "60% of the cohort, reserved by design" },
      { value: "05", unit: "TRK", label: "Specialist Tracks", sub: "One learner, one deep vertical" },
    ],
    progressLabel: "WOMEN-IN-TECH ALLOCATION",
    progressText: "30 / 50 — 60%",
    progressPercent: 60,
    tracks: [
      "Human-Centered Design",
      "Data for Social Good",
      "Frontend Web Development",
      "Mobile Development",
      "Backend Engineering",
    ],
  },

  pillars: {
    headerImageUrl: "/photos/card3.jpg",
    eyebrow: "The Three Pillars",
    heading: "One studio. Three load-bearing structures.",
    subheading:
      "We merge rigorous social research with innovative technology to tackle Uganda's most pressing community challenges. Every project passes through the same three structures.",
    items: [
      {
        title: "Research & Development",
        summary: "We identify community needs, conduct rigorous studies, and develop ethical tech solutions.",
      },
      {
        title: "Education & Mentorship",
        summary: "We empower the next generation through hands-on training, bootcamps, and mentorship.",
      },
      {
        title: "Dissemination & Outreach",
        summary: "We share knowledge through publications, open-source contributions, and partnerships.",
      },
    ],
    rndIntro: "Six stages, in sequence. Nothing skips a step.",
    rndSteps: [
      { label: "Problem Identification", desc: "Field immersion with communities to surface real, lived constraints — not assumed ones." },
      { label: "Feasibility Studies", desc: "Technical, economic, and infrastructural viability mapped against local conditions." },
      { label: "Community Validation", desc: "Prototypes stress-tested by the people the system is built to serve." },
      { label: "Dataset Creation", desc: "Local, representative, ethically-sourced datasets built where none existed." },
      { label: "Solution Development", desc: "Open, maintainable engineering shipped with the community, not to it." },
      { label: "Impact Assessment", desc: "Longitudinal measurement of outcomes fed back into the research loop." },
    ],
    eduIntro: "How we train, and how the 2026 Innovation Bootcamp is run.",
    eduItems: [
      { title: "Curriculum Mechanics", desc: "Project-first modules sequenced from computational fundamentals through applied systems, tuned to regional industry demand." },
      { title: "Practical Training Frameworks", desc: "Every learner ships production artifacts: live repositories, deployed services, and datasets reviewed in the open." },
      { title: "Structured Mentorship Protocols", desc: "1:4 mentor ratios, weekly technical reviews, and career pathing anchored by the 2026 Innovation Bootcamp cohort." },
    ],
    outreachIntro: "How our work leaves the studio — open by default.",
    outreachItems: [
      { title: "Open Source Pathways", desc: "Core studio infrastructure released under permissive licences with public roadmaps and contributor onboarding.", tag: "$ git clone rcr/core" },
      { title: "Publications", desc: "Peer-reviewed research and accessible technical writing documenting methods, datasets, and failures honestly.", tag: "$ rcr publish --open" },
      { title: "Regional Policy Influence", desc: "Evidence briefs and advisory vectors shaping East African technology governance and data sovereignty law.", tag: "$ rcr policy --region=EA" },
    ],
  },

  team: {
    headerImageUrl: "/photos/band.jpg",
    eyebrow: "Team & Values",
    heading: "The people, and what they refuse to compromise.",
    subheading:
      "The humans in Kampala holding the studio to its five values.",
    mission:
      "To merge social research and technology in identifying and addressing pressing community challenges, creating ethical digital solutions that drive sustainable social impact.",
    vision:
      "A future where ethical, research-driven technologies transform communities and empower generations.",
    valuesLabel: "Our values",
    membersLabel: "The team",
    values: [
      { code: "V.01", title: "Build on Proof", desc: "No system ships on assumption. Feasibility studies, validated datasets, and measured impact precede every line of production code." },
      { code: "V.02", title: "Build with Community", desc: "The people a system serves are its first reviewers, not its last." },
      { code: "V.03", title: "Build with Integrity", desc: "Ethical data practice, honest reporting of failures, transparent funding." },
      { code: "V.04", title: "Build to Empower", desc: "Every project transfers capability outward — skills, tools, and ownership stay local." },
      { code: "V.05", title: "Build on Open Knowledge", desc: "Research, code, and datasets published in the open by default. Black boxes end here — knowledge compounds when it is shared, cited, forked, and improved by the region it serves." },
    ],
    members: [
      { name: "Julian Zaabu Kayikayi", role: "Co-founder & Lead Researcher", initials: "JK", photoUrl: "" },
      { name: "Kevin Ziyada Aseru", role: "Co-founder & Lead Technologist", initials: "KA", photoUrl: "" },
      { name: "Suzan Ayikoru", role: "Dissemination & Outreach Lead", initials: "SA", photoUrl: "" },
      { name: "Elizabeth Saidi", role: "Education & Mentorship Lead", initials: "ES", photoUrl: "" },
      { name: "Maria Gonzaga Nnabakka", role: "Education & Mentorship Lead", initials: "MG", photoUrl: "/team/maria-gonzaga.jpg" },
    ],
  },

  partnership: {
    headerImageUrl: "/photos/card2.jpg",
    eyebrow: "Partner with us",
    heading: "Fund work that stays in the region.",
    subheading:
      "Four modular tiers. Every shilling is accounted for in the open — our transparency reports publish where partner capital goes.",
    tiers: [
      {
        name: "Bronze", code: "T.01", amount: "$10", cadence: "/ month",
        desc: "Keep a learner connected — data bundles and platform access.",
        features: ["Named in the annual transparency report", "Quarterly research digest", "Community Discord access"],
        popular: false,
      },
      {
        name: "Silver", code: "T.02", amount: "$50", cadence: "/ month",
        desc: "Sponsor a bootcamp seat's tooling, cloud credits, and materials.",
        features: ["Everything in Bronze", "Logo on the Academy cohort page", "Early access to published datasets", "Invitations to demo days"],
        popular: true,
      },
      {
        name: "Gold", code: "T.03", amount: "$150", cadence: "/ month",
        desc: "Underwrite a full women-in-tech scholarship each cohort.",
        features: ["Everything in Silver", "Named scholarship attribution", "Direct hiring pipeline to graduates", "Co-branded research briefs"],
        popular: false,
      },
      {
        name: "Platinum", code: "T.04", amount: "Custom", cadence: "partnership",
        desc: "Institutional alliances — research programs, policy work, infrastructure.",
        features: ["Everything in Gold", "Joint research & publication programs", "Advisory seat on studio roadmap", "Regional deployment partnerships"],
        popular: false,
      },
    ],
    callout:
      "You don't need to give $150. You can give $10... In-kind support, mentorship time, software licences, or cloud credits are equally welcome.",
  },

  events: {
    headerImageUrl: "/photos/band.jpg",
    eyebrow: "Gatherings",
    heading: "Where the work meets people",
    subheading:
      "Hackathons, demo days, research workshops, and community showcases — a look back at moments from the studio and the Academy.",
    upcomingHeading: "Coming up",
    upcomingSubheading:
      "Register and the meeting invite lands in your inbox before the event.",
    // slug is the registration key — keep it stable once people have registered.
    upcoming: [
      {
        slug: "rca-demo-day-2026",
        dateISO: "2026-08-29",
        title: "RCA Bootcamp 2026 — Demo Day",
        category: "Academy",
        location: "Online · Google Meet",
        blurb:
          "The 2026 cohort closes twelve weeks of research, design, and code with live demos of their solutions to six real community problems. Open to partners, press, and anyone curious.",
      },
    ],
    pastHeading: "Past events",
    // Newest first. Each entry is one moment on the timeline.
    list: [
      {
        date: "June 2026",
        year: "2026",
        title: "Research Code Academy — Cohort 2026 Kickoff",
        category: "Academy",
        location: "Online · Kampala",
        blurb:
          "Fifty-four fellows from fourteen countries opened twelve weeks of research, design, and code — meeting their tracks, mentors, and the six community problems they'd spend the cohort solving.",
        photoUrl: "/photos/card1.jpg",
        href: "/academy",
      },
      {
        date: "February 2026",
        year: "2026",
        title: "Community Research Workshop",
        category: "Research",
        location: "Kampala, Uganda",
        blurb:
          "A working session with community partners to surface real, lived constraints — the field immersion that every RCR project starts from.",
        photoUrl: "/photos/card2.jpg",
        href: "",
      },
      {
        date: "November 2025",
        year: "2025",
        title: "Open-Source Build Weekend",
        category: "Outreach",
        location: "Kampala, Uganda",
        blurb:
          "Two days of building in the open — contributors shipped to studio repositories and datasets, with onboarding for first-time open-source developers.",
        photoUrl: "/photos/card3.jpg",
        href: "",
      },
      {
        date: "August 2025",
        year: "2025",
        title: "Mentorship & Careers Meetup",
        category: "Education",
        location: "Kampala, Uganda",
        blurb:
          "Fellows, alumni, and mentors gathered for technical reviews and career pathing — the structured mentorship that anchors the Academy.",
        photoUrl: "/photos/hero.jpg",
        href: "",
      },
    ],
  },
};

export type SiteContent = typeof SITE_CONTENT;
export type SectionKey = keyof SiteContent;
