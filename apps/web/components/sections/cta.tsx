import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { CopyButton } from "@/components/ui/copy-button";

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-edge">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-20 text-center text-background sm:px-12">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.15] [--grid-line:0_0%_100%]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-background/10 blur-3xl" />

            <div className="relative">
              <TextReveal
                as="h2"
                text="Start charging for your API today."
                className="mx-auto block max-w-2xl text-balance text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
              />
              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md text-pretty text-lg text-background/70">
                  Production-focused and in Public Beta. Protect a route and get
                  ready for your first production deployment — you&rsquo;re
                  early.
                </p>
              </Reveal>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Magnetic strength={0.3}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-background text-foreground hover:bg-background/90"
                  >
                    <Link href="/docs">
                      Install Run402
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </Button>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="border-background/25 bg-transparent text-background hover:bg-background/10"
                  >
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </Magnetic>
              </div>

              <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-background/20 bg-background/5 py-2 pl-4 pr-2 font-mono text-sm text-background/80">
                <span>
                  <span className="text-background/50">$</span> npm install run402
                </span>
                <CopyButton
                  value="npm install run402"
                  className="border-background/20 bg-background/10 text-background hover:text-background"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
