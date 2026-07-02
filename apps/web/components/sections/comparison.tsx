import { Check, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const oldWay = [
  "Integrate the Stripe SDK by hand",
  "Write and test billing logic",
  "Design a payment UI",
  "Build & verify webhooks",
  "Manage API keys and secrets",
  "Weeks of engineering work",
];

const newWay = [
  "Install one package",
  "Wrap your route with protect()",
  "Set a price",
  "Ship it",
  "Watch revenue in the dashboard",
  "Under 2 minutes",
];

export function Comparison() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="The difference"
          title="Weeks of plumbing, or one line"
          description="Everything payments used to demand, collapsed into a single wrapper."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal className="rounded-2xl border border-border bg-background p-8">
            <p className="section-label">The old way</p>
            <ul className="mt-6 space-y-4">
              {oldWay.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] text-muted-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <X className="h-3 w-3" />
                  </span>
                  <span className="line-through decoration-border">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="flex items-center justify-center">
            <span className="rounded-full border border-border bg-background px-4 py-2 font-mono text-xs text-muted-foreground">
              VS
            </span>
          </div>

          <Reveal
            delay={0.1}
            className="rounded-2xl border border-foreground/15 bg-foreground p-8 text-background shadow-lift"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-background/60">
              With Run402
            </p>
            <ul className="mt-6 space-y-4">
              {newWay.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] text-background"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background/15">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
