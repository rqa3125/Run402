import { NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/handler";
import { getCliSummary } from "@/lib/data/cli";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  projectKey: z.string().min(1),
  logLimit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * POST /api/run402/cli/summary — project + endpoints + recent logs for the CLI
 * (`run402 dev / status / logs`). Public, authenticated by the project key.
 */
export const POST = apiHandler(async (req) => {
  enforceRateLimit({ key: `cli:${clientIp(req.headers)}`, limit: 120, windowMs: 60_000 });
  const { projectKey, logLimit } = schema.parse(await req.json());
  const summary = await getCliSummary(projectKey, logLimit);
  return NextResponse.json(summary);
});
