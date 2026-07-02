import { NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/handler";
import { verifyRequest } from "@/lib/data/verify";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  projectKey: z.string().min(1, "projectKey is required"),
  method: z.string().min(1),
  path: z.string().min(1),
  token: z.string().nullish(),
});

/**
 * POST /api/run402/verify — the endpoint the Express middleware calls on every
 * request. Public (authenticated by the project key + token capability). The
 * middleware relays the returned status + body verbatim to its caller.
 */
export const POST = apiHandler(async (req) => {
  enforceRateLimit({
    key: `verify:${clientIp(req.headers)}`,
    limit: 300,
    windowMs: 60_000,
  });
  const input = schema.parse(await req.json());
  const result = await verifyRequest(input);
  return NextResponse.json(result.body, { status: result.httpStatus });
});
