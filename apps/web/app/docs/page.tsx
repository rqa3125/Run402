import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  ShieldCheck,
  Webhook,
  BarChart3,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CodeBlock } from "@/components/ui/code-block";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Get started with Run402 — install, protect a route, and start charging for your API in minutes.",
};

const guides = [
  { icon: Rocket, title: "Quickstart", body: "Install and protect your first route in under two minutes.", href: "/docs" },
  { icon: ShieldCheck, title: "Protecting routes", body: "Pricing, subscriptions, and metered usage per endpoint.", href: "/docs" },
  { icon: Terminal, title: "SDK reference", body: "Typed client for Node, edge, and serverless runtimes.", href: "/docs" },
  { icon: Webhook, title: "Webhooks", body: "Subscribe to payment, refund, and usage events.", href: "/docs" },
  { icon: BarChart3, title: "Analytics", body: "Track revenue, conversion, and endpoint performance.", href: "/docs" },
  { icon: BookOpen, title: "Guides", body: "Framework recipes for Express, Fastify, and Next.js.", href: "/docs" },
];

const quickstart = `import express from "express"
import { protect } from "run402"

const app = express()

app.use(
  "/premium",
  protect({ price: "$0.50" })
)

app.get("/premium", (req, res) => {
  res.json({ data: "🔓 premium unlocked" })
})

app.listen(3000)`;

export default function DocsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documentation"
        title="Ship a paid API in minutes"
        description="Everything you need to install Run402, protect routes, and start collecting payments — with copy-paste examples."
      />

      <section className="py-20">
        <div className="container-edge grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="section-label">Quickstart</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Install, protect, charge
            </h2>
            <ol className="mt-6 space-y-4">
              {[
                "Install run402 with your package manager",
                "Wrap a route with protect() and set a price",
                "Deploy — Stripe Checkout is handled for you",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <Button asChild className="mt-8">
              <Link href="/docs">
                Read the full guide <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Reveal>
            <CodeBlock code={quickstart} lang="ts" filename="server.ts" />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container-edge">
          <h2 className="text-2xl font-semibold tracking-tight">Explore the docs</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <Link
                key={g.title}
                href={g.href}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/50">
                  <g.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 flex items-center gap-1.5 text-base font-semibold tracking-tight">
                  {g.title}
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {g.body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
