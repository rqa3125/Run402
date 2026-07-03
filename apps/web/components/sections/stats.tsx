import { Users, ShieldCheck, Activity, Handshake } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const milestones = [
  {
    icon: Users,
    title: "100 Developers",
    subtitle: "Early Adopters Goal",
    description:
      "Our first milestone is onboarding 100 developers to validate the Run402 developer experience.",
    progress: 0,
  },
  {
    icon: ShieldCheck,
    title: "500 Protected APIs",
    subtitle: "APIs Protected Goal",
    description:
      "Help developers protect their first 500 API endpoints using Run402.",
    progress: 0,
  },
  {
    icon: Activity,
    title: "10,000 Requests",
    subtitle: "Requests Processed Goal",
    description: "Reach our first 10,000 successful protected API requests.",
    progress: 0,
  },
  {
    icon: Handshake,
    title: "10 Design Partners",
    subtitle: "Launch Partners",
    description:
      "Work closely with 10 companies to shape the future of API monetization.",
    progress: 0,
  },
];

export function Stats() {
  return (
    <section className="border-b border-border bg-muted/30 py-24 sm:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground shadow-soft">
              <span aria-hidden>🚀</span> Building in Public
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              Phase 1 Roadmap
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Our first public milestone. These are the goals we&rsquo;re
              working toward before the public launch of Run402.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.08}>
              <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/40 transition-colors duration-300 group-hover:bg-muted">
                    <m.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    Not Started
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">
                    {m.title}
                  </h3>
                  <p className="section-label mt-2">{m.subtitle}</p>
                </div>

                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  {m.description}
                </p>

                <div className="mt-auto pt-8">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums">
                      {m.progress}%
                    </span>
                  </div>
                  <div
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={m.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
