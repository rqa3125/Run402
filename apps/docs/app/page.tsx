import { BookOpen, Terminal } from "lucide-react";
import { Badge, CodeBlock } from "@run402/ui";

const installSnippet = `npm install run402`;

const protectSnippet = `import express from "express"
import { protect } from "run402"

const app = express()

// Everything under /premium now requires payment.
app.use(
  "/premium",
  protect({
    projectKey: process.env.RUN402_SECRET_KEY, // secret key — server-side only
    endpoint: "/premium",                       // must match a registered endpoint
  })
)

app.get("/premium", (req, res) => {
  res.json({ data: "premium unlocked" })
})

app.listen(4000)`;

const runSnippet = `# 1. Start the Run402 control plane (dashboard)
pnpm --filter @run402/dashboard dev      # http://localhost:3001

# 2. Start your Express app
RUN402_SECRET_KEY=sk_live_... npm run dev  # http://localhost:4000`;

const flowSnippet = `# Unpaid request → 402 Payment Required
$ curl -i http://localhost:4000/premium
HTTP/1.1 402 Payment Required
{ "error": "Payment Required", "payment_url": "http://localhost:3001/mock-checkout?payment=pay_..." }

# Open payment_url, click "Pay", copy the token, then retry:
$ curl -H "x-run402-token: rt_..." http://localhost:4000/premium
HTTP/1.1 200 OK
{ "data": "premium unlocked" }`;

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DocsHome() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4" /> Documentation
        <Badge variant="secondary" className="ml-1">
          Quickstart
        </Badge>
      </div>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        Monetize an API in minutes
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Wrap an Express route, register it in the dashboard, and start charging
        per request — powered by the HTTP 402 standard.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">$</span> npm install run402
      </div>

      <div className="mt-12 space-y-12">
        <Step n={1} title="Install">
          <CodeBlock code={installSnippet} lang="bash" />
        </Step>

        <Step n={2} title="Protect an endpoint">
          <p className="text-sm text-muted-foreground">
            Create a project and a <code className="font-mono">GET /premium</code>{" "}
            sandbox endpoint in the dashboard, then wrap the route:
          </p>
          <CodeBlock code={protectSnippet} lang="ts" filename="server.ts" />
        </Step>

        <Step n={3} title="Run locally">
          <CodeBlock code={runSnippet} lang="bash" />
        </Step>

        <Step n={4} title="Expected flow">
          <p className="text-sm text-muted-foreground">
            The first request is blocked with a 402 and a checkout URL. After a
            (mock) payment you get a token; retrying with it returns 200.
          </p>
          <CodeBlock code={flowSnippet} lang="bash" />
        </Step>
      </div>
    </div>
  );
}
