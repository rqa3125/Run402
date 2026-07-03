import { createHash, randomBytes } from "node:crypto";
import { db, pgClient } from "./client";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

/**
 * Seed a demo project + endpoint + sandbox keys for local development.
 * Run: `pnpm --filter @run402/database db:seed`
 * Prints the plaintext secret key (shown once, as in production).
 */
const rid = (p: string) => `${p}_${randomBytes(12).toString("hex")}`;
const tok = (n: number) => randomBytes(n).toString("base64url");

async function main() {
  const userId = process.env.SEED_USER_ID ?? "user_seedtest";
  const publishableKey = `pk_live_${tok(18)}`;
  const secretKey = `sk_live_${tok(24)}`;
  const secretKeyHash = createHash("sha256").update(secretKey).digest("hex");
  const secretKeyPreview = `${secretKey.slice(0, 11)}…${secretKey.slice(-4)}`;
  const projectId = rid("proj");
  const endpointId = rid("end");

  await db.delete(schema.project).where(eq(schema.project.userId, userId));

  await db.insert(schema.project).values({
    id: projectId,
    userId,
    name: "Weather API",
    description: "Seeded demo project",
    publishableKey,
    secretKeyHash,
    secretKeyPreview,
    currency: "usd",
    pricePerRequest: 500_000, // $0.50
    status: "active",
  });

  await db.insert(schema.apiKey).values([
    { id: rid("key"), projectId, type: "publishable", key: publishableKey, environment: "sandbox" },
    { id: rid("key"), projectId, type: "secret", key: secretKeyPreview, keyHash: secretKeyHash, environment: "sandbox" },
  ]);

  await db.insert(schema.endpoint).values({
    id: endpointId,
    projectId,
    name: "Premium data",
    description: "Seeded endpoint",
    method: "GET",
    path: "/premium",
    price: 500_000,
    environment: "sandbox",
    status: "active",
  });

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({ projectId, endpointId, publishableKey, secretKey }, null, 2),
  );
  await pgClient.end();
}

main().catch((error) => {
  console.error("[db] seed failed", error);
  process.exit(1);
});
