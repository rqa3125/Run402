import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CodeBlock } from "@/components/ui/code-block";

const code = `import { protect } from "run402"

// Charge $1 for every request to /premium
app.use(
  "/premium",
  protect({
    price: "$1",
    metadata: { plan: "pro" }
  })
)

// Everything else stays free
app.get("/health", (req, res) => res.send("ok"))`;

const highlights = [
  "One import, one wrapper — no SDK glue",
  "Per-route pricing, subscriptions, or metered usage",
  "Works with Express, Fastify, Next.js & more",
];

export function CodeExample() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 sm:py-28">
      <div className="container-edge">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              label="Developer experience"
              title="The whole integration fits on one screen"
              description="No billing logic. No webhooks to wire. No payment UI to design. Wrap a route and you’re charging."
            />
            <ul className="mt-8 space-y-3">
              {highlights.map((h, i) => (
                <Reveal key={i} delay={0.1 + i * 0.06} as="li">
                  <span className="flex items-start gap-3 text-[15px] text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    {h}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <CodeBlock code={code} lang="ts" filename="server.ts" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
