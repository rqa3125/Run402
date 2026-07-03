import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";

const metrics = [
  { label: "Beta Developers", value: 147 },
  { label: "Projects Created", value: 32 },
  { label: "Protected Endpoints", value: 211 },
  { label: "Launch Partners", value: 4 },
];

export function BetaProgress() {
  return (
    <section className="border-b border-border">
      <div className="container-edge py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beta-glow" />
            Public Beta Progress
          </span>
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Built alongside early developers
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 divide-x divide-y divide-border border-x border-t border-border lg:grid-cols-4 lg:divide-y-0 lg:border-t-0 lg:border-l">
          {metrics.map((m, i) => (
            <Reveal
              key={m.label}
              delay={i * 0.06}
              className="flex flex-col items-center gap-1 px-6 py-10 text-center sm:py-12"
            >
              <span className="text-4xl font-semibold tracking-[-0.02em] tabular-nums sm:text-5xl">
                <CountUp value={m.value} />
              </span>
              <span className="section-label mt-1">{m.label}</span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Updated weekly as we build in public.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
