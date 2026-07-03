/**
 * Provider-agnostic payments contract. The middleware and control-plane API
 * depend only on `PaymentProvider` — never on Mock or Stripe directly — so a
 * new processor (Stripe, x402, crypto, PayPal) is added by implementing this
 * interface and registering it in the factory.
 */

export type ProviderName = "mock" | "stripe" | "x402";

export type PaymentStatus = "pending" | "paid" | "refunded" | "expired";

export interface Payment {
  id: string;
  status: PaymentStatus;
  /** Amount in micro-dollars (1 USD = 1_000_000), matching endpoint pricing. */
  amount: number;
  currency: string;
  /** Hosted checkout URL the payer is sent to. */
  checkoutUrl: string;
  metadata: Record<string, string>;
  createdAt: number;
  expiresAt: number;
}

export interface CreatePaymentInput {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  /** Origin used to build the checkout URL, e.g. http://localhost:3001 */
  checkoutBaseUrl: string;
  /** Time until the payment (and its checkout) expires. Default 1h. */
  expiresInMs?: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  /** The provider payment id this event concerns, if any. */
  paymentId?: string;
  data: unknown;
}

export interface PaymentProvider {
  readonly name: ProviderName;
  /** Create a pending payment and return its hosted checkout URL. */
  createPayment(input: CreatePaymentInput): Promise<Payment>;
  /** Current payment status. Providers lazily expire past `expiresAt`. */
  verifyPayment(paymentId: string): Promise<Payment>;
  /** Refund a paid payment. */
  refund(paymentId: string): Promise<Payment>;
  /**
   * Verify + parse an incoming provider webhook (Stripe). Optional — the mock
   * provider settles synchronously and has no webhooks.
   */
  verifyWebhook?(payload: string, signature: string): Promise<WebhookEvent>;
}
