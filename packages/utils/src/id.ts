import { createId, isCuid } from "@paralleldrive/cuid2";

/**
 * Prefixed, collision-resistant identifiers (Stripe-style: `proj_abc123`).
 * Prefixes make ids self-describing in logs, URLs and support tickets.
 */
export const ID_PREFIXES = {
  user: "usr",
  organization: "org",
  member: "mem",
  project: "proj",
  apiKey: "key",
  endpoint: "end",
  payment: "pay",
  paymentToken: "tok",
  requestLog: "req",
  invitation: "inv",
} as const;

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];

/** Generate a prefixed id, e.g. `newId("project")` → `proj_x1y2z3...`. */
export function newId(entity: keyof typeof ID_PREFIXES): string {
  return `${ID_PREFIXES[entity]}_${createId()}`;
}

/** Validate that a string is a well-formed prefixed id for `entity`. */
export function isId(value: string, entity: keyof typeof ID_PREFIXES): boolean {
  const prefix = `${ID_PREFIXES[entity]}_`;
  if (!value.startsWith(prefix)) return false;
  return isCuid(value.slice(prefix.length));
}

export { createId as rawId };
