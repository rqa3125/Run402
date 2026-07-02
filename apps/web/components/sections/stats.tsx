import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";

const stats = [
  { label: "Developers", value: 18400, suffix: "+", compact: false },
  { label: "APIs Protected", value: 42000, suffix: "+", compact: false },
  { label: "Revenue Processed", value: 9.4, prefix: "$", suffix: "M", decimals: 1 },
  { label: "API Requests", value: 128, suffix: "M", decimals: 0 },
];

export function Stats() {
  return (
    <section className="border-b border-border">
      <div className="container-edge grid grid-cols-2 divide-x divide-y divide-border border-x border-border lg:grid-cols-4 lg:divide-y-0">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.06}
            className="flex flex-col gap-1 px-6 py-10 sm:py-12"
          >
            <span className="text-4xl font-semibold tracking-[-0.02em] tabular-nums sm:text-5xl">
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
              />
            </span>
            <span className="section-label mt-1">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
