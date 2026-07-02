import { resolveConfig, verify } from "run402";
import { type NextRequest, NextResponse } from "next/server";

/**
 * A Run402-protected Next.js Route Handler.
 *
 * Express has a dedicated `protect()` middleware; for other frameworks you can
 * use the lower-level `verify()` primitive directly, as shown here. Config is
 * resolved lazily inside the handler so `next build` never needs the secret.
 */
export async function GET(req: NextRequest) {
  const config = resolveConfig({
    projectKey: process.env.RUN402_SECRET_KEY,
    endpoint: "/api/premium",
  });

  const token = req.headers.get("x-run402-token") ?? undefined;
  const result = await verify(config, {
    method: "GET",
    path: config.endpoint,
    token,
  });

  if (result.status === 200) {
    return NextResponse.json({ data: "🔓 premium unlocked" });
  }
  return NextResponse.json(result.body, { status: result.status });
}
