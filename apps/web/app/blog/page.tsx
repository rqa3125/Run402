import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/content/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product updates, engineering deep dives, and guides on API monetization from the Run402 team.",
};

export default function BlogPage() {
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Writing on APIs, billing & building"
        description="Product updates, engineering notes, and guides to help you monetize your API."
      />

      <section className="py-20">
        <div className="container-edge">
          <Reveal>
            <Link
              href={`/blog`}
              className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift lg:grid-cols-2"
            >
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden border-b border-border bg-muted/40 lg:border-b-0 lg:border-r">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <span className="relative font-mono text-7xl font-semibold tracking-tighter text-foreground/80">
                  402
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <Badge>{featured.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(featured.date)} · {featured.readingTime}
                  </span>
                </div>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium">
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <Link
                  href="/blog"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 text-xs text-muted-foreground">
                    {formatDate(post.date)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
