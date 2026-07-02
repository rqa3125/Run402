"use client";

import { motion } from "framer-motion";
import {
  Receipt,
  CreditCard,
  BarChart3,
  Gauge,
  Webhook,
  ShieldHalf,
  Code2,
  Zap,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { staggerContainer, staggerItem } from "@/components/ui/reveal";

const features = [
  {
    icon: Receipt,
    title: "Automatic Billing",
    body: "Invoices, receipts, and revenue tracking generated for every paid request.",
  },
  {
    icon: CreditCard,
    title: "Stripe Checkout",
    body: "Hosted, PCI-compliant payment pages spun up automatically per route.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    body: "Real-time revenue, conversion, and endpoint performance in one dashboard.",
  },
  {
    icon: Gauge,
    title: "Usage Tracking",
    body: "Meter calls per key, per user, or per plan with zero extra code.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    body: "Subscribe to payment, refund, and usage events with signed deliveries.",
  },
  {
    icon: ShieldHalf,
    title: "Rate Limiting",
    body: "Protect endpoints with per-key limits and automatic 429 handling.",
  },
  {
    icon: Code2,
    title: "Developer SDK",
    body: "Fully typed client for Node, edge runtimes, and serverless functions.",
  },
  {
    icon: Zap,
    title: "One-Line Integration",
    body: "Wrap a route with protect() and you’re live. Nothing else to configure.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="Features"
          title="Everything billing needs, handled"
          description="Run402 replaces weeks of payments plumbing with a single dependency."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <SpotlightCard
              key={f.title}
              variants={staggerItem}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/50 transition-all duration-300 group-hover:-rotate-6 group-hover:bg-foreground group-hover:text-background">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </SpotlightCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
