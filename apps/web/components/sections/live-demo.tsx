import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { PaymentFlow } from "./payment-flow";
import { Check } from "lucide-react";

const points = [
  "Send a request to a protected route",
  "Receive a 402 with a Stripe Checkout link",
  "Pay, and the original request replays",
  "Get your 200 OK — access granted",
];

export function LiveDemo() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="Live demo"
          title="See the 402 flow for yourself"
          description="This is exactly what your users experience — drive it manually and replay as many times as you like."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ol className="space-y-5">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-muted-foreground">
                    {p}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
              No account needed — try the interactive demo →
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <PaymentFlow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
