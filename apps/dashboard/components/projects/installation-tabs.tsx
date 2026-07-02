"use client";

import {
  CodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@run402/ui";
import { markOnboarding } from "@/lib/onboarding";

const INSTALL = "npm install run402";

function example(
  framework: "node" | "express" | "fastify" | "next",
  endpoint: string,
): string {
  switch (framework) {
    case "express":
      return `import express from "express"
import { protect } from "run402/express"

const app = express()

app.use(
  "${endpoint}",
  protect({
    projectKey: process.env.RUN402_SECRET_KEY,
    endpoint: "${endpoint}",
  })
)`;
    case "fastify":
      return `import Fastify from "fastify"
import { protect } from "run402/fastify"

const app = Fastify()

app.addHook(
  "onRequest",
  protect({
    projectKey: process.env.RUN402_SECRET_KEY,
    endpoint: "${endpoint}",
  })
)`;
    case "next":
      return `import { protect } from "run402/next"

// app/api/premium/route.ts
export const GET = protect({
  projectKey: process.env.RUN402_SECRET_KEY,
  endpoint: "${endpoint}",
})(async () => {
  return Response.json({ data: "premium" })
})`;
    default:
      return `import { protect } from "run402"

app.use(
  "${endpoint}",
  protect({
    projectKey: process.env.RUN402_SECRET_KEY,
    endpoint: "${endpoint}",
  })
)`;
  }
}

const FRAMEWORKS = [
  { id: "node", label: "Node" },
  { id: "express", label: "Express" },
  { id: "fastify", label: "Fastify" },
  { id: "next", label: "Next.js" },
] as const;

export function InstallationTabs({
  projectId,
  samplePath,
}: {
  projectId: string;
  samplePath: string;
}) {
  return (
    <Tabs defaultValue="node">
      <TabsList className="w-full justify-start overflow-x-auto">
        {FRAMEWORKS.map((f) => (
          <TabsTrigger key={f.id} value={f.id}>
            {f.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {FRAMEWORKS.map((f) => (
        <TabsContent key={f.id} value={f.id} className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium">1 · Install the SDK</p>
            <CodeBlock
              code={INSTALL}
              lang="bash"
              onCopied={() => markOnboarding(projectId, "installed")}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">2 · Protect a route</p>
            <CodeBlock
              code={example(f.id, samplePath)}
              lang="ts"
              filename="server.ts"
            />
            <p className="text-xs text-muted-foreground">
              Set <code className="font-mono">RUN402_SECRET_KEY</code> to your
              project&apos;s secret key (server-side only — never ship it to a
              browser).
            </p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
