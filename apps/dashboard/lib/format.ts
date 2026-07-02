/** Display helpers for money and dates. */

/** Micro-dollars (1 USD = 1_000_000) → the stored integer for a price input. */
export const PRICE_SCALE = 1_000_000;

export function dollarsToMicros(dollars: number): number {
  return Math.round(dollars * PRICE_SCALE);
}

export function microsToDollars(micros: number): number {
  return micros / PRICE_SCALE;
}

/** Format a micro-dollar price like `$0.005` in the given currency. */
export function formatPrice(micros: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(microsToDollars(micros));
}

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
