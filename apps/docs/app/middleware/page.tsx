import type { Metadata } from "next";
import { CodeBlock } from "@run402/ui";
import { DocHeader, RefTable, Section } from "@/components/doc";
import { Callout } from "@/components/callout";

export const metadata: Metadata = { title: "Middleware" };

const c = (t: string) => <code className="font-mono">{t}</code>;

export default function MiddlewareDocs() {
  return (
    <div>
      <DocHeader
        title="Middleware"
        lead="protect() gates an Express route behind a Run402 payment."
      />

      <Section title="Usage">
        <CodeBlock
          code={`import express from "express"
import { protect } from "run402"

const app = express()

app.use("/premium", protect({
  projectKey: process.env.RUN402_SECRET_KEY, // secret key, server-side only
  endpoint: "/premium",
  price: "$0.50",
}))

app.get("/premium", (req, res) => res.json({ data: "unlocked" }))`}
          lang="ts"
          filename="server.ts"
        />
      </Section>

      <Section title="Options">
        <RefTable
          head={["Option", "Type", "Description"]}
          rows={[
            [c("projectKey"), c("string?"), "Secret key. Falls back to RUN402_SECRET_KEY."],
            [c("endpoint"), c("string"), "Registered route this guards, e.g. /premium."],
            [c("price"), c("string | number?"), 'Display hint, e.g. "$0.50".'],
            [c("mode"), c('"payment"'), '"subscription" arrives with Stripe.'],
            [c("successUrl"), c("string?"), "Redirect on successful checkout."],
            [c("cancelUrl"), c("string?"), "Redirect on cancelled checkout."],
            [c("baseUrl"), c("string?"), "Control-plane origin (default localhost:3001)."],
            [c("tokenHeader"), c("string?"), "Token header (default x-run402-token)."],
          ]}
        />
      </Section>

      <Section title="How it works">
        <p>
          On each request the middleware asks the control plane to verify: if the
          request carries a valid token it calls <code className="font-mono">next()</code>;
          otherwise it relays a 402 with a <code className="font-mono">payment_url</code>.
        </p>
      </Section>

      <Section title="Errors">
        <RefTable
          head={["code", "Status", "Meaning"]}
          rows={[
            [c("invalid_key"), "401", "projectKey doesn't match a project"],
            [c("invalid_token"), "401", "token not found"],
            [c("token_mismatch"), "403", "token is for a different endpoint"],
            [c("unknown_endpoint"), "404", "route not registered in the dashboard"],
            [c("run402_unavailable"), "502", "control plane unreachable"],
          ]}
        />
      </Section>

      <Callout type="warning" title="Non-Express frameworks">
        Express has a dedicated <code className="font-mono">protect()</code>. For Next/Fastify,
        use the lower-level <code className="font-mono">verify()</code> primitive — see Examples.
      </Callout>
    </div>
  );
}
