import { MockPaymentProvider } from "./providers/mock";
import { StripePaymentProvider } from "./providers/stripe";
import type { PaymentProvider, ProviderName } from "./types";

export interface PaymentsConfig {
  provider: ProviderName;
  stripe?: { apiKey: string; webhookSecret?: string };
}

/**
 * Selects a payment provider at runtime from config. New providers (Stripe,
 * x402, crypto, PayPal) are added here without changing any call site.
 */
export function createPaymentProvider(config: PaymentsConfig): PaymentProvider {
  switch (config.provider) {
    case "mock":
      return new MockPaymentProvider();
    case "stripe":
      if (!config.stripe?.apiKey) {
        throw new Error("[payments] Stripe selected but STRIPE_SECRET_KEY is missing.");
      }
      return new StripePaymentProvider(config.stripe);
    case "x402":
      throw new Error("[payments] The x402 provider is planned but not available yet.");
    default: {
      const _exhaustive: never = config.provider;
      throw new Error(`[payments] Unknown provider: ${String(_exhaustive)}`);
    }
  }
}
