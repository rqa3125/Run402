"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { plans } from "@/content/pricing";
import { cn } from "@/lib/utils";

export function Pricing({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section id="pricing" className="scroll-mt-24 py-24 sm:py-28">
      <div className="container-edge">
        {withHeading && (
          <SectionHeading
            label="Pricing"
            title="Simple pricing that scales with you"
            description="Start free. Upgrade when your API starts earning. No hidden fees on top of Stripe."
          />
        )}

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 260, damping: 24, mass: 0.6 },
              }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 [transition:box-shadow_300ms_ease]",
                plan.featured
                  ? "border-foreground/20 bg-card shadow-lift ring-1 ring-foreground/10 hover:shadow-glow"
                  : "border-border bg-card shadow-soft hover:shadow-lift"
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-[-0.02em]">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <Button
                asChild
                variant={plan.featured ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
