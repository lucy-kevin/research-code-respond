import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { getPosts } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Research Code Respond",
  description:
    "Field notes, research updates, and stories from the Research Code Respond studio and the RCA Bootcamp.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="From the studio"
        title="Field notes"
        description="Research updates, bootcamp stories, and what we're learning on the ground."
        media={{ image: "/photos/card2.jpg" }}
        variant="plum"
      />
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-16 lg:px-8">
        {posts.length === 0 ? (
          <p className="text-sm text-[#6B7280]">
            No posts yet — the first one is coming soon.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-[#1A1A1A]/8 bg-[#E9D5FF]/40">
                  {post.cover_url && (
                    <Image
                      src={post.cover_url}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <p className="mt-4 text-xs text-[#6B7280]">
                  {formatDate(post.published_at)}
                </p>
                <h2 className="mt-1.5 text-lg font-semibold leading-snug text-[#1A1A1A] transition-colors group-hover:text-[#6B21E8]">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280] line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
