import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CoverArt } from "@/components/cover-art";
import { CtaSection } from "@/components/cta-section";
import { getPost, posts, type Block } from "@/content/posts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post
    ? {
        title: post.title,
        description: post.excerpt,
        openGraph: { type: "article", title: post.title, description: post.excerpt },
      }
    : {};
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="mt-14 text-[1.625rem] font-medium leading-tight tracking-[-0.03em] text-bone">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <figure key={i} className="my-12 border-l-2 border-ember pl-6">
          <blockquote className="font-serif text-[1.75rem] leading-[1.25] text-bone">{block.text}</blockquote>
          {block.cite && <figcaption className="mt-3 text-sm text-mute">{block.cite}</figcaption>}
        </figure>
      );
    case "list":
      return (
        <ul key={i} className="mt-6 grid gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[1.0625rem] leading-[1.75] text-bone/85">
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p key={i} className="mt-6 text-[1.0625rem] leading-[1.8] text-bone/85">
          {block.text}
        </p>
      );
  }
}

export default async function PostPage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <article className="pb-20 pt-32 sm:pt-40">
        <header className="container-x max-w-[820px]">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-bone"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            All posts
          </Link>
          <div className="animate-fade-up">
            <p className="eyebrow mt-10 text-ember">{post.category}</p>
            <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.045em] text-bone">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-mute">{post.excerpt}</p>
            <div className="mt-8 flex items-center gap-3 border-t border-white/[0.07] pt-6">
              <Avatar name={post.author.name} hue={post.author.hue} className="size-10 text-sm" />
              <span className="text-sm">
                <span className="block text-bone">{post.author.name}</span>
                <span className="block text-dim">{post.author.role}</span>
              </span>
              <span className="ml-auto text-right text-sm text-dim">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="block">{post.readingTime}</span>
              </span>
            </div>
          </div>
        </header>

        <div className="container-x mt-12 max-w-[1080px] animate-fade-up [animation-delay:150ms]">
          <div className="relative aspect-[16/7] overflow-hidden rounded-[28px] border border-white/[0.08]">
            <CoverArt hue={post.hue} seed={21} className="absolute inset-0" />
          </div>
        </div>

        <div className="container-x mt-8 max-w-[720px]">{post.body.map(renderBlock)}</div>
      </article>

      <section className="border-t border-white/[0.06] py-20">
        <div className="container-x max-w-[1080px]">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-bone">Keep reading</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {more.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group surface flex gap-5 rounded-[24px] p-4 transition-colors hover:border-white/15"
              >
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl">
                  <CoverArt hue={p.hue} seed={i + 30} className="absolute inset-0" />
                </div>
                <div className="min-w-0 py-1">
                  <p className="eyebrow text-dim">{p.category}</p>
                  <p className="mt-2 font-medium leading-snug text-bone group-hover:text-ember-2">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
