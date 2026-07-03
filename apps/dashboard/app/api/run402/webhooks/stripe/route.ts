import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { paymentProvider } from "@/lib/payments";
import { completePayment } from "@/lib/data/payments";
import { BadRequestError } from "@run402/utils/errors";

/**
 * POST /api/run402/webhooks/stripe — Stripe delivers checkout events here.
 * On `checkout.session.completed` we mark the payment paid and issue the access
 * token. Signature is verified by the provider (constructEvent). Public: Stripe
 * has no session — the signature IS the auth.
 *
 * Only active when PAYMENTS_PROVIDER=stripe; the mock provider settles
 * synchronously via /api/run402/checkout/pay instead.
 */
export const POST = apiHandler(async (req, api) => {
  if (!paymentProvider.verifyWebhook) {
    // Mock provider — no webhooks.
    return NextResponse.json({ received: true, ignored: "no webhook provider" });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) throw new BadRequestError("Missing stripe-signature header");

  const payload = await req.text();
  const event = await paymentProvider.verifyWebhook(payload, signature);

  if (event.type === "checkout.session.completed" && event.paymentId) {
    const result = await completePayment(event.paymentId);
    api.log.info(
      { event: event.type, paymentId: event.paymentId, ok: result.ok },
      "stripe webhook processed",
    );
  } else {
    api.log.info({ event: event.type }, "stripe webhook ignored");
  }

  return NextResponse.json({ received: true });
});
