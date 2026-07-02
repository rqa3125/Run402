import type { Metadata } from "next";
import { DocHeader, RefTable, Section } from "@/components/doc";
import { Callout } from "@/components/callout";

export const metadata: Metadata = { title: "Troubleshooting" };

const c = (t: string) => <code className="font-mono">{t}</code>;

export default function TroubleshootingDocs() {
  return (
    <div>
      <DocHeader
        title="Troubleshooting"
        lead="Run `run402 doctor` first — it catches most issues automatically."
      />

      <Section title="Common errors">
        <RefTable
          head={["Symptom", "Cause", "Fix"]}
          rows={[
            [
              c("Missing Configuration"),
              "No projectKey / endpoint",
              <>Set <code className="font-mono">RUN402_SECRET_KEY</code> or pass options.</>,
            ],
            [
              c("401 invalid_key"),
              "Wrong or unknown key",
              "Copy the secret key from Dashboard → API Keys.",
            ],
            [
              c("404 unknown_endpoint"),
              "Route not registered",
              "Create a matching endpoint (method + path) in the dashboard.",
            ],
            [
              c("402 loop"),
              "Token not sent on retry",
              <>Send <code className="font-mono">x-run402-token</code> on the retry request.</>,
            ],
            [
              c("502 run402_unavailable"),
              "Control plane down",
              "Start the dashboard and check baseUrl.",
            ],
          ]}
        />
      </Section>

      <Callout type="tip" title="Every error is self-service">
        Run402 errors explain what happened, why, how to fix it, and link to docs.
      </Callout>
    </div>
  );
}
