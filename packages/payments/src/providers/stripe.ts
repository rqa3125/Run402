import Stripe from "stripe";
import type {
  CreatePaymentInput,
  Payment,
  PaymentProvider,
  PaymentStatus,
  WebhookEvent,
} from "../types";

export interface StripeProviderConfig {
  apiKey: string;
  webhookSecret?: string;
}

/** Micro-dollars (1 USD = 1_000_000) → Stripe minor units (cents). */
const toCents = (micros: number) => Math.round(micros / 10_000);

function mapStatus(session: Stripe.Checkout.Session): PaymentStatus {
  if (session.payment_status === "paid") return "paid";
  if (session.status === "expired") return "expired";
  return "pending";
}

/**
 * Stripe payments via Checkout Sessions. Fully implemented; activated by
 * `PAYMENTS_PROVIDER=stripe` with `STRIPE_SECRET_KEY` set. Settlement is async:
 * the client is redirected to Stripe's hosted checkout, and completion arrives
 * via the `checkout.session.completed` webhook (see verifyWebhook).
 */
export class StripePaymentProvider implements PaymentProvider {
  readonly name = "stripe" as const;
  private readonly stripe: Stripe;

  constructor(private readonly config: StripeProviderConfig) {
    this.stripe = new Stripe(config.apiKey);
  }

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    const now = Date.now();
    const ttl = input.expiresInMs ?? 60 * 60 * 1000;
    // Stripe requires expires_at ≥ 30 minutes out.
    const expiresAt = now + Math.max(ttl, 31 * 60 * 1000);
    const base = input.checkoutBaseUrl.replace(/\/$/, "");
    const meta = input.metadata ?? {};

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency,
            unit_amount: toCents(input.amount),
            product_data: { name: "API request (Run402)" },
          },
        },
      ],
      success_url:
        meta.successUrl ??
        `${base}/checkout/success?payment={CHECKOUT_SESSION_ID}`,
      cancel_url: meta.cancelUrl ?? `${base}/checkout/cancel`,
      expires_at: Math.floor(expiresAt / 1000),
      metadata: meta,
    });

    return {
      id: session.id,
      status: mapStatus(session),
      amount: input.amount,
      currency: input.currency,
      checkoutUrl: session.url ?? "",
      metadata: meta,
      createdAt: now,
      expiresAt,
    };
  }

  async verifyPayment(paymentId: string): Promise<Payment> {
    const session = await this.stripe.checkout.sessions.retrieve(paymentId);
    return {
      id: session.id,
      status: mapStatus(session),
      amount: (session.amount_total ?? 0) * 10_000,
      currency: session.currency ?? "usd",
      checkoutUrl: session.url ?? "",
      metadata: (session.metadata as Record<string, string>) ?? {},
      createdAt: (session.created ?? 0) * 1000,
      expiresAt: (session.expires_at ?? 0) * 1000,
    };
  }

  async refund(paymentId: string): Promise<Payment> {
    const session = await this.stripe.checkout.sessions.retrieve(paymentId);
    const intent = session.payment_intent;
    if (!intent) throw new Error("[payments] No payment intent to refund.");
    await this.stripe.refunds.create({
      payment_intent: typeof intent === "string" ? intent : intent.id,
    });
    const refreshed = await this.verifyPayment(paymentId);
    return { ...refreshed, status: "refunded" };
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent> {
    if (!this.config.webhookSecret) {
      throw new Error("[payments] STRIPE_WEBHOOK_SECRET is not configured.");
    }
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.config.webhookSecret,
    );
    const object = event.data.object as { id?: string; metadata?: Record<string, string> };
    return {
      id: event.id,
      type: event.type,
      paymentId: object?.id,
      data: event.data.object,
    };
  }
}
