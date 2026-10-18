import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CoverArt } from "@/components/cover-art";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Accent } from "@/components/section-heading";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes on running operations with AI agents, from the team building Halvo.",
};

function formatPostDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Field notes on <Accent>running ops with agents.</Accent>
          </>
        }
        body="Product thinking, engineering deep-dives and lessons from the operations teams we work with."
      />

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[28px] border border-white/[0.08] lg:grid-cols-[1.25fr_1fr]"
            >
              <div className="relative min-h-[280px] lg:min-h-[440px]">
                <CoverArt
                  hue={featured.hue}
                  seed={11}
                  className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col bg-ink-900 p-8 sm:p-10">
                <p className="eyebrow text-ember">Latest · {featured.category}</p>
                <h2 className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-bone">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-mute">{featured.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 pt-10">
                  <Avatar name={featured.author.name} hue={featured.author.hue} className="size-9 text-xs" />
                  <span className="text-sm">
                    <span className="block text-bone">{featured.author.name}</span>
                    <span className="block text-dim">
                      {formatPostDate(featured.date)} · {featured.readingTime}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto size-5 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          </Reveal>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900"
                >
                  <div className="relative aspect-[16/8]">
                    <CoverArt
                      hue={post.hue}
                      seed={i + 12}
                      className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-8">
                    <p className="eyebrow text-dim">
                      {post.category} · {formatPostDate(post.date)}
                    </p>
                    <h2 className="mt-4 text-xl font-medium leading-snug tracking-[-0.02em] text-bone">{post.title}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-mute">{post.excerpt}</p>
                    <p className="mt-6 text-sm text-dim">
                      {post.author.name} · {post.readingTime}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
