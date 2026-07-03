import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/lib/site";

const benefits = [
  "Lifetime Early Access",
  "Direct Founder Support",
  "Private Discord",
  "Feature Requests",
  "Early Product Updates",
];

export function FoundingDevelopers() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-edge">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-background px-6 py-16 shadow-soft sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.4] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beta-glow" />
                Early Access Open
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                Join the Founding Developers
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Become one of the first developers helping shape Run402.
              </p>
            </div>

            <div className="relative mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-medium"
                >
                  <Check className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                  {b}
                </span>
              ))}
            </div>

            <div className="relative mt-10 flex justify-center">
              <Magnetic strength={0.3}>
                <Button asChild size="lg">
                  <Link href={site.dashboardUrl}>
                    Join Public Beta
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
