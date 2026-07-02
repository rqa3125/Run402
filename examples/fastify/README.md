# run402 · Fastify example (placeholder)

> ⚠️ Fastify does not have a dedicated `protect()` adapter yet. This example
> guards a route using the framework-agnostic `verify()` primitive. A
> first-class `run402/fastify` adapter is planned.

```bash
pnpm install
RUN402_SECRET_KEY=sk_live_xxx pnpm --filter @run402/example-fastify dev   # :4002
```

```bash
curl -i http://localhost:4002/premium                     # 402
curl -H "x-run402-token: rt_..." http://localhost:4002/premium   # 200
```
