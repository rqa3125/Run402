import Stripe from "stripe";
import type { CreatePaymentInput, Payment, PaymentProvider } from "../types";

export interface StripeProviderConfig {
  apiKey: string;
  webhookSecret?: string;
}

/**
 * Stripe provider — integration seam only. The client is constructed but method
 * bodies are deferred to the Stripe sprint. Its presence proves the interface
 * has a real second implementation and that the factory can select it.
 */
export class StripePaymentProvider implements PaymentProvider {
  readonly name = "stripe" as const;
  private readonly stripe: Stripe;

  constructor(private readonly config: StripeProviderConfig) {
    this.stripe = new Stripe(config.apiKey);
  }

  private notImplemented(method: string): never {
    throw new Error(
      `[payments] StripePaymentProvider.${method} is not implemented yet.`,
    );
  }

  async createPayment(_input: CreatePaymentInput): Promise<Payment> {
    return this.notImplemented("createPayment");
  }

  async verifyPayment(_paymentId: string): Promise<Payment> {
    return this.notImplemented("verifyPayment");
  }

  async refund(_paymentId: string): Promise<Payment> {
    return this.notImplemented("refund");
  }
}
