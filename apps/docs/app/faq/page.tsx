import type { Metadata } from "next";
import { DocHeader } from "@/components/doc";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "Do I need Stripe to try Run402?",
    a: "No. Run402 ships with a mock payment provider so you can run the entire 402 → payment → 200 flow locally. Stripe arrives in a later release.",
  },
  {
    q: "Which key does the middleware use?",
    a: "Your secret key (sk_…), server-side only. It's matched against a stored hash — the plaintext is shown once at creation.",
  },
  {
    q: "How does the client prove it paid?",
    a: "After a payment it receives a single-use token, sent back on retry via the x-run402-token header. The middleware grants access for a valid, unexpired token that matches the endpoint.",
  },
  {
    q: "Are tokens reusable?",
    a: "No — tokens are single-use and expire (15 minutes by default). Each paid request consumes one token.",
  },
  {
    q: "Which frameworks are supported?",
    a: "Express has a dedicated protect() middleware. Next.js and Fastify use the verify() primitive today; dedicated adapters are planned.",
  },
  {
    q: "Where do prices come from?",
    a: "The price registered on the endpoint in the dashboard is authoritative. The price option in protect() is a local display hint.",
  },
];

export default function FaqDocs() {
  return (
    <div>
      <DocHeader title="FAQ" lead="Common questions about Run402." />
      <div className="divide-y divide-border border-y border-border">
        {faqs.map((f) => (
          <div key={f.q} className="py-5">
            <h3 className="font-medium">{f.q}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
