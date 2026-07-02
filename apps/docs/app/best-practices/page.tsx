import type { Metadata } from "next";
import { DocHeader, Section } from "@/components/doc";
import { Callout } from "@/components/callout";

export const metadata: Metadata = { title: "Best Practices" };

export default function BestPracticesDocs() {
  return (
    <div>
      <DocHeader
        title="Best Practices"
        lead="A few habits that keep your integration secure and reliable."
      />

      <Section title="Keys">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Use the <strong>secret key</strong> server-side; never ship it to a browser.</li>
          <li>Load it from an environment variable — never commit it.</li>
          <li>Rotate the secret immediately if it leaks (Dashboard → API Keys → Regenerate).</li>
          <li>The publishable key is safe to expose; the secret is not.</li>
        </ul>
      </Section>

      <Section title="Tokens">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Treat payment tokens as single-use and short-lived.</li>
          <li>Forward the token only to the endpoint it was issued for.</li>
        </ul>
      </Section>

      <Section title="Reliability">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>The middleware fails closed (502) when the control plane is unreachable.</li>
          <li>Register every protected route in the dashboard so lookups resolve.</li>
          <li>Run <code className="font-mono">run402 doctor</code> in CI to catch config drift.</li>
        </ul>
      </Section>

      <Callout type="tip" title="Verify before you ship">
        <code className="font-mono">run402 test</code> exercises the full 402 → payment →
        200 flow — a great smoke test for staging.
      </Callout>
    </div>
  );
}
