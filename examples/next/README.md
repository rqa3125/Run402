# run402 · Next.js example

A single protected Route Handler.

```bash
pnpm install
RUN402_SECRET_KEY=sk_live_xxx pnpm --filter @run402/example-next dev   # :4001
```

Register a `GET /api/premium` sandbox endpoint in the dashboard, then:

```bash
curl -i http://localhost:4001/api/premium            # 402
curl -H "x-run402-token: rt_..." http://localhost:4001/api/premium   # 200
```

Express has a dedicated `protect()` middleware; other frameworks use the
`verify()` primitive directly (see `app/api/premium/route.ts`).
