import { CalendarClock, Users, MessageCircle, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const pillars = [
  {
    icon: CalendarClock,
    title: "Weekly Updates",
    body: "We ship and share progress every week. No black boxes — you see the roadmap move in real time.",
  },
  {
    icon: Users,
    title: "Community Driven",
    body: "Features are prioritized by the developers actually using Run402, not a distant roadmap committee.",
  },
  {
    icon: MessageCircle,
    title: "Founder Accessible",
    body: "Talk directly to the founder. Ideas, bugs, and requests reach the person building the product.",
  },
  {
    icon: Rocket,
    title: "Fast Iteration",
    body: "Small team, tight loop. Feedback today can turn into a shipped feature within days.",
  },
];

export function BuildingInPublic() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="Building in Public"
          title="Why we're building in public"
          description="Run402 is being built in the open with feedback from developers around the world. Every feature, every release and every improvement is driven by our early community. If you're joining today, you're helping shape the future of API payments."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/40 transition-colors duration-300 group-hover:bg-muted">
                  <p.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
