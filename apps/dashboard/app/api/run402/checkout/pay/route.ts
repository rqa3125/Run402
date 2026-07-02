import { NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/handler";
import { completePayment } from "@/lib/data/payments";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({ paymentId: z.string().min(1) });

const FAILURES: Record<string, { status: number; message: string }> = {
  not_found: { status: 404, message: "Payment not found" },
  expired: { status: 410, message: "This payment has expired" },
  already_done: { status: 409, message: "Payment already processed" },
};

/**
 * POST /api/run402/checkout/pay — the mock "Pay" action. Marks the payment
 * paid and returns a single-use access token. Public (the payment id is the
 * capability).
 */
export const POST = apiHandler(async (req) => {
  enforceRateLimit({
    key: `pay:${clientIp(req.headers)}`,
    limit: 60,
    windowMs: 60_000,
  });
  const { paymentId } = schema.parse(await req.json());
  const result = await completePayment(paymentId);

  if (!result.ok) {
    const failure = FAILURES[result.reason ?? "not_found"];
    return NextResponse.json(
      { error: { code: result.reason, message: failure.message } },
      { status: failure.status },
    );
  }

  return NextResponse.json({ token: result.token });
});
