import Fastify from "fastify";
import { resolveConfig, verify } from "run402";

/**
 * ⚠️ PLACEHOLDER — Fastify has no dedicated `protect()` adapter yet. This shows
 * how to guard a route today using the framework-agnostic `verify()` primitive
 * in an `onRequest` hook. A first-class `run402/fastify` adapter is planned.
 */
const config = resolveConfig({
  projectKey: process.env.RUN402_SECRET_KEY,
  endpoint: "/premium",
});

const app = Fastify();

app.addHook("onRequest", async (req, reply) => {
  if (req.url !== "/premium") return;
  const token = (req.headers["x-run402-token"] as string | undefined) ?? undefined;
  const result = await verify(config, { method: req.method, path: "/premium", token });
  if (result.status !== 200) {
    reply.code(result.status).send(result.body);
  }
});

app.get("/premium", async () => ({ data: "🔓 premium unlocked" }));

const port = Number(process.env.PORT ?? 4002);
app.listen({ port }).then(() => {
  // eslint-disable-next-line no-console
  console.log(`▲ run402 fastify example on http://localhost:${port}`);
});
