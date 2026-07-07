/**
 * One-time import of the blog posts from the previous site
 * (researchcoderesolve.org) into Supabase, cover images included.
 *
 * Usage: npx tsx scripts/seed-blog.ts
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

process.loadEnvFile(".env.local");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const POSTS = [
  {
    slug: "the-silence-between-our-data",
    title: "The Silence Between Our Data",
    author: "Kevin Ziyada Aseru",
    published_at: "2025-10-25T09:00:00Z",
    cover: "https://researchcoderesolve.org/images/silent_data.png",
    excerpt:
      "The deadliest number in African development is not zero; it is the blank cell no one notices until the ambulance, the loan, or the vaccine never arrives.",
    body: `The deadliest number in African development is not zero; it is the blank cell no one notices until the ambulance, the loan, or the vaccine never arrives.

Across the continent, the most persistent development failures are hidden not in noise but in absence: the negative space where rows should exist but do not. Here are three verified cases that show what happens when silence becomes a policy variable.

The 2024 National Population and Housing Census in Uganda undercounted approximately 1.8 percent of the population, largely among pastoralist households in Karamoja and the Lake Victoria islands (Uganda Bureau of Statistics [UBOS], 2024). Because the Ministry of Health's vaccine micro planning algorithm uses census data as its sampling frame, villages left uncounted were assigned zero malaria vaccine doses. A follow up audit estimated that about 28,000 children above the official coverage threshold received no dose in 2024 (author's calculation based on UBOS, 2024, undercount tables).

A Nairobi based fintech used call detail records to train a gradient boosting model for digital credit. Women are 38 percent less likely than men to own a 4G phone, so their records were sparse. Instead of flagging the absence, the model converted "no data" into a negative feature weight. When deployed, rejection rates for female micro entrepreneurs in Kibera rose from 42 percent to 67 percent. The Central Bank of Kenya's (2023) FinTech Sandbox Report confirmed the bias and proposed a regulation requiring an "algorithmic silence impact statement" before any AI credit score is licensed.

During the COVID 19 pandemic in Nigeria, Lagos State still relied on paper burial permits. The World Health Organization's (WHO Afro, 2022) retrospective audit found that 62 percent of "data free weeks" coincided with cemetery overflow periods. Africa's reported COVID 19 mortality remained low, yet modelled excess deaths reached 3.1 million, with Nigeria contributing the largest single share.

These examples show that silence is not a passive void; it is an active distortion that reallocates public goods and embeds discrimination into machine learning systems.

At RCR | Research Code Resolve, we treat silence as a first class variable. Our workflow is straightforward:

Community co governance: local leaders co write variable definitions before any data are collected.

Ethical curation: metadata capture why cells are blank (refusal, cost, geography) rather than imputing blindly.

Open algorithms: model cards publish representation parity scores and the exact re weighting applied to the loss function.

Policy Seed: If we require environmental impact assessments before pouring concrete, we should also demand data silence impact statements before deploying code. A statutory one page pre-mortem that quantifies expected silence rates by gender, age, and geography, together with a mitigation budget, would place the burden of proof on the project rather than on the uncounted citizen.

Blank spreadsheets are not neutral; they are policy decisions written in invisible ink. Naming the silence is the first step toward technology that serves everyone.

— Kevin Ziyada Aseru`,
  },
  {
    slug: "delayed-by-design",
    title: "Delayed by Design: Why Africa's Late Start is Its Greatest AI Asset",
    author: "Suzan Ayikoru",
    published_at: "2025-11-22T09:00:00Z",
    cover: "https://researchcoderesolve.org/images/kenyan_girl.png",
    excerpt:
      "We don't have to copy yesterday's mistakes. Africa's late start is its superpower, allowing us to leapfrog global AI failures and build ethical, sustainable systems based on Ubuntu.",
    body: `Everyone calls it a "delay." When pundits talk about Artificial Intelligence in Africa, the narrative is almost always about playing catch-up. But what if that timing isn't a deficit? What if it is our greatest strategic advantage? Think about it. We have the luxury of hindsight. We are watching the rest of the world stumble through expensive failures, ethical breaches, and unsustainable energy consumption. Africa has a unique opportunity to skip the "move fast and break things" phase. We don't need to copy yesterday's mistakes; we can leapfrog directly into building AI that is wiser, sustainable, and specifically engineered for our reality. This isn't about slowing down. It's about capitalizing on our position to design systems that work for us, systems grounded in African infrastructure and African values.

This advantage is already evident when we examine the continent's current AI landscape. It's not just happening, it's happening with specific intent. Across the continent, countries are carving out unique specializations: Kenya is leveraging AI to modernize agriculture, while Rwanda is investing heavily in human capital, focusing on data science capacity building. Meanwhile, Uganda is embedding AI into university curricula, and Tanzania is directing its efforts toward healthcare applications. In West Africa, startup ecosystems are exploding, supported by North African policy advancements. This activity is fundamentally different from global trends because African developers operate under constraint. We deal with limited hardware, expensive connectivity, and smaller, localized datasets. This forces us to be better engineers. We are building lightweight, decentralized systems and hybrid human-AI workflows, innovating out of necessity and creating efficient models that don't require a nuclear power plant to run.

This context of constraint is vital because it protects us from the root causes of global AI failures. Think about the many AI projects that have collapsed in North America and Europe. Why did they fail? According to recent studies (Ryseff et al., 2024), it's rarely because a line of code was technically wrong. Instead, projects crash due to human errors: bad management, top-down mandates that ignore local realities, and most often, a complete disconnect from the people who are actually supposed to use the technology. The Global North is littered with high-accuracy models that failed in the real world because the leaders didn't account for social context or governance. Africa can't afford to burn cash on hype. Because we are entering the game now, we can learn from these mistakes and treat governance, stakeholder engagement, and utility as mandatory requirements from the start, prioritizing impact over raw algorithmic accuracy. We are building our pathway based on observed global shortcomings.

Furthermore, our late start allows us to integrate a robust ethical framework that the rest of the world bypassed: Ubuntu. Most global AI ethics frameworks are built on Western individualism, focusing on individual privacy and liability. Africa offers a more profound alternative. The core philosophy of Ubuntu, "I am because we are," shifts the focus of AI from individual rights to communal well-being. When applied to technology, this fundamentally changes how we handle data and manage risk. It reimagines accountability not as a legal disclaimer, but as a community responsibility. By integrating these indigenous traditions, we can create governance models that protect communities and enforce ethical accountability in ways Silicon Valley never considered (Yilma, 2025).

Ultimately, our goal is to translate these lessons, frugality from constraints, caution from failures, and communal ethics from Ubuntu, into a coherent AI for Development (AI4D) blueprint. This means moving beyond "cool tech" to "necessary tech." For AI to drive sustainable development across sectors like health, education, and the environment, we must adhere to specific design principles. An African-centric AI model must be Resource-Sensitive, featuring algorithms designed to run on low-power devices and edge computing. It must utilize Participatory Design, ensuring systems are built with the community to fit the socio-political context. Most importantly, it must be Social-Outcome Driven, where success is measured by tangible improvements in public value and resilience, rather than internal technical metrics (Mienye et al., 2024). The literature is clear: the pathway to success involves observing global failures, mapping them against African realities, and filtering the solution through our own ethical lens. We aren't late. We are right on time to build the version of AI the world actually needs.

— Suzan Ayikoru`,
  },
];

async function main() {
  for (const post of POSTS) {
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();
    if (existing) {
      console.log(`skip (exists): ${post.slug}`);
      continue;
    }

    let cover_url: string | null = null;
    try {
      const res = await fetch(post.cover);
      if (res.ok) {
        const raw = Buffer.from(await res.arrayBuffer());
        const out = await sharp(raw)
          .resize(2200, 2200, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 88, mozjpeg: true })
          .toBuffer();
        const path = `blog/${post.slug}.jpg`;
        const { error } = await supabase.storage
          .from("photos")
          .upload(path, out, { contentType: "image/jpeg", upsert: true });
        if (!error) {
          cover_url = supabase.storage.from("photos").getPublicUrl(path)
            .data.publicUrl;
        }
      }
    } catch {
      console.warn(`  cover failed for ${post.slug}`);
    }

    const { error } = await supabase.from("posts").insert({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      cover_url,
      published: true,
      published_at: post.published_at,
    });
    console.log(
      error
        ? `insert failed for ${post.slug}: ${error.message}`
        : `✓ ${post.slug}${cover_url ? " (with cover)" : ""}`
    );
  }
  console.log("Done.");
}

main();
