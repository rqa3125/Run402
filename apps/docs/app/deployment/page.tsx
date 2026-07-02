import type { Metadata } from "next";
import { CodeBlock } from "@run402/ui";
import { DocHeader, Section } from "@/components/doc";
import { Callout } from "@/components/callout";

export const metadata: Metadata = { title: "Deployment" };

export default function DeploymentDocs() {
  return (
    <div>
      <DocHeader
        title="Deployment"
        lead="Point your app at a running Run402 control plane."
      />

      <Section title="Environment">
        <p>Set these in your production environment:</p>
        <CodeBlock
          code={`RUN402_SECRET_KEY=sk_live_...
RUN402_BASE_URL=https://your-run402-control-plane.example.com`}
          lang="bash"
        />
      </Section>

      <Section title="Control plane">
        <p>
          The dashboard app is the control plane. Deploy it (any Node host that
          runs Next.js) with a Postgres database and your Clerk keys, then apply
          the schema:
        </p>
        <CodeBlock
          code={`pnpm --filter @run402/database db:migrate
pnpm --filter @run402/dashboard build && pnpm --filter @run402/dashboard start`}
          lang="bash"
        />
      </Section>

      <Callout type="warning" title="Sandbox only, for now">
        Live mode, real checkout, and production payments arrive with the Stripe
        integration. Until then, deployments run against the sandbox provider.
      </Callout>
    </div>
  );
}
