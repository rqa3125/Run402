import type { Metadata } from "next";
import { CodeBlock } from "@run402/ui";
import { DocHeader, RefTable, Section } from "@/components/doc";
import { Callout } from "@/components/callout";

export const metadata: Metadata = { title: "CLI" };

const cmd = (c: string) => <code className="font-mono">{c}</code>;

export default function CliDocs() {
  return (
    <div>
      <DocHeader
        title="CLI"
        lead="Set up, diagnose, and test your integration from the terminal."
      />

      <Section title="Install & invoke">
        <p>The CLI ships with the Run402 package:</p>
        <CodeBlock code={`npx run402 <command>`} lang="bash" />
        <p>Every command supports <code className="font-mono">--help</code>.</p>
      </Section>

      <Section title="Commands">
        <RefTable
          head={["Command", "What it does"]}
          rows={[
            [cmd("run402 init"), "Interactive setup → generates run402.config.ts"],
            [cmd("run402 login"), "Save credentials to ~/.run402"],
            [cmd("run402 doctor"), "Diagnose config, network, env, Node version"],
            [cmd("run402 dev"), "Live request stream for your project"],
            [cmd("run402 test"), "Run the full 402 → payment → 200 flow"],
            [cmd("run402 status"), "Project status + endpoints"],
            [cmd("run402 logs"), "Recent request logs (--limit, --status)"],
            [cmd("run402 version"), "CLI + Node versions"],
          ]}
        />
      </Section>

      <Section title="Get started in 60 seconds">
        <CodeBlock
          code={`run402 init      # scaffold run402.config.ts
run402 doctor    # verify everything is wired up
run402 test      # 402 → pay → 200, end to end
run402 dev       # watch requests stream in live`}
          lang="bash"
        />
      </Section>

      <Callout type="tip" title="Config resolution">
        The CLI resolves your project key from <code className="font-mono">run402.config.ts</code>,
        then a saved login, then <code className="font-mono">RUN402_SECRET_KEY</code>.
      </Callout>
    </div>
  );
}
