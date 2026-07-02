import { Package, ShieldCheck, CreditCard, Unlock } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    icon: Package,
    step: "01",
    title: "Install package",
    body: "Add run402 to your project. Zero config, works with any Node framework.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Protect endpoint",
    body: "Wrap any route with protect() and set a price. That’s the entire integration.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Customer pays",
    body: "Unpaid requests get a 402 and a hosted Stripe Checkout. No UI to build.",
  },
  {
    icon: Unlock,
    step: "04",
    title: "API unlocks",
    body: "On success the request replays automatically and your endpoint responds.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="How it works"
          title="From install to income in four steps"
          description="No billing logic. No infrastructure. No payment code. Just protect a route and charge."
        />

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[34px] hidden h-px bg-border lg:block" />
          <div className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08} className="relative">
                <div className="relative z-10 mb-6 inline-flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-border bg-background shadow-soft">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
