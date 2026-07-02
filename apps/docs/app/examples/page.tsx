import type { Metadata } from "next";
import {
  CodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@run402/ui";
import { DocHeader, Section } from "@/components/doc";
import { Callout } from "@/components/callout";

export const metadata: Metadata = { title: "Examples" };

const express = `import express from "express"
import { protect } from "run402"

const app = express()
app.use("/premium", protect({
  projectKey: process.env.RUN402_SECRET_KEY,
  endpoint: "/premium",
}))
app.get("/premium", (_req, res) => res.json({ data: "unlocked" }))
app.listen(4000)`;

const next = `import { resolveConfig, verify } from "run402"

export async function GET(req: Request) {
  const config = resolveConfig({
    projectKey: process.env.RUN402_SECRET_KEY,
    endpoint: "/api/premium",
  })
  const token = req.headers.get("x-run402-token") ?? undefined
  const result = await verify(config, { method: "GET", path: "/api/premium", token })
  if (result.status === 200) return Response.json({ data: "unlocked" })
  return Response.json(result.body, { status: result.status })
}`;

const fastify = `import Fastify from "fastify"
import { resolveConfig, verify } from "run402"

const config = resolveConfig({ projectKey: process.env.RUN402_SECRET_KEY, endpoint: "/premium" })
const app = Fastify()

app.addHook("onRequest", async (req, reply) => {
  if (req.url !== "/premium") return
  const token = req.headers["x-run402-token"] as string | undefined
  const result = await verify(config, { method: req.method, path: "/premium", token })
  if (result.status !== 200) reply.code(result.status).send(result.body)
})

app.get("/premium", async () => ({ data: "unlocked" }))`;

export default function ExamplesDocs() {
  return (
    <div>
      <DocHeader
        title="Examples"
        lead="Runnable examples live in the examples/ directory of the repo."
      />

      <Section title="By framework">
        <Tabs defaultValue="express">
          <TabsList>
            <TabsTrigger value="express">Express</TabsTrigger>
            <TabsTrigger value="next">Next.js</TabsTrigger>
            <TabsTrigger value="fastify">Fastify</TabsTrigger>
          </TabsList>
          <TabsContent value="express">
            <CodeBlock code={express} lang="ts" filename="server.ts" />
          </TabsContent>
          <TabsContent value="next">
            <CodeBlock code={next} lang="ts" filename="app/api/premium/route.ts" />
          </TabsContent>
          <TabsContent value="fastify">
            <CodeBlock code={fastify} lang="ts" filename="server.ts" />
          </TabsContent>
        </Tabs>
      </Section>

      <Callout type="info" title="Run them">
        <code className="font-mono">
          RUN402_SECRET_KEY=sk_… pnpm --filter @run402/example-express dev
        </code>
      </Callout>

      <Callout type="warning" title="Fastify is a placeholder">
        Fastify has no dedicated adapter yet — the example uses the framework-agnostic{" "}
        <code className="font-mono">verify()</code> primitive.
      </Callout>
    </div>
  );
}
