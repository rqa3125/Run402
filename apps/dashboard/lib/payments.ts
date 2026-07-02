import {
  createPaymentProvider,
  MockPaymentProvider,
  type PaymentProvider,
} from "@run402/payments";

/**
 * Process-wide payment provider, selected from PAYMENTS_PROVIDER (mock today).
 * Cached on globalThis so the mock's in-memory state survives Next HMR. The
 * database is the durable ledger; the provider simulates the external processor
 * and the middleware only ever sees the `PaymentProvider` interface.
 */
const globalForPayments = globalThis as unknown as {
  __run402_payments?: PaymentProvider;
};

export const paymentProvider: PaymentProvider =
  globalForPayments.__run402_payments ??
  createPaymentProvider({
    provider:
      (process.env.PAYMENTS_PROVIDER as "mock" | "stripe" | undefined) ?? "mock",
    stripe: process.env.STRIPE_SECRET_KEY
      ? { apiKey: process.env.STRIPE_SECRET_KEY }
      : undefined,
  });

globalForPayments.__run402_payments = paymentProvider;

/** The mock exposes `complete()`/`expire()` beyond the shared interface. */
export function asMock(): MockPaymentProvider | null {
  return paymentProvider instanceof MockPaymentProvider ? paymentProvider : null;
}

/** Origin used to build hosted checkout URLs. */
export const checkoutBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
