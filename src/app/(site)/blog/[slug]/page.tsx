import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/content";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found — Research Code Respond" };
  return {
    title: `${post.title} — Research Code Respond`,
    description: post.excerpt,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="bg-[#FAF9F5] px-6 pb-28 pt-36 sm:pt-44 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <p className="mt-8 text-xs text-[#6B7280]">
          {formatDate(post.published_at)}
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase leading-tight tracking-tight text-[#1A1A1A] sm:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-[#4B5563]">
            {post.excerpt}
          </p>
        )}

        {post.cover_url && (
          <div className="relative mt-10 aspect-[2/1] overflow-hidden rounded-2xl border border-[#1A1A1A]/8">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-10 space-y-6">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-[#374151]">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
