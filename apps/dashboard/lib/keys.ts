import { createHash, randomBytes } from "node:crypto";

/**
 * API key generation + hashing. Server-only (imports node:crypto).
 *
 * The publishable key is public. The secret key is returned to the caller
 * exactly once; we persist only its SHA-256 hash and a masked preview, so a
 * database leak never exposes usable secrets.
 */

const token = (bytes: number) => randomBytes(bytes).toString("base64url");

export function generatePublishableKey(): string {
  return `pk_live_${token(18)}`;
}

export function generateSecretKey(): string {
  return `sk_live_${token(24)}`;
}

export function hashSecretKey(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

/** Masked form safe to store and display, e.g. `sk_live_a1b2…wxyz`. */
export function previewSecretKey(secret: string): string {
  return `${secret.slice(0, 11)}…${secret.slice(-4)}`;
}

export interface GeneratedKeys {
  publishableKey: string;
  secretKey: string; // plaintext — return once, never persist
  secretKeyHash: string;
  secretKeyPreview: string;
}

export function generateProjectKeys(): GeneratedKeys {
  const publishableKey = generatePublishableKey();
  const secretKey = generateSecretKey();
  return {
    publishableKey,
    secretKey,
    secretKeyHash: hashSecretKey(secretKey),
    secretKeyPreview: previewSecretKey(secretKey),
  };
}
