import { NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/handler";
import { getTokenForPayment } from "@/lib/data/payments";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({ paymentId: z.string().min(1) });

/**
 * POST /api/run402/checkout/token — poll for the access token of a paid
 * payment. Used by the Stripe redirect flow after checkout completes (the
 * webhook issues the token asynchronously). Returns 202 while still pending.
 */
export const POST = apiHandler(async (req) => {
  enforceRateLimit({ key: `token:${clientIp(req.headers)}`, limit: 120, windowMs: 60_000 });
  const { paymentId } = schema.parse(await req.json());
  const token = await getTokenForPayment(paymentId);
  if (!token) {
    return NextResponse.json({ status: "pending" }, { status: 202 });
  }
  return NextResponse.json({ status: "paid", token });
});
