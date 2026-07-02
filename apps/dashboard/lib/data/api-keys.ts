import { and, asc, db, eq, schema, type ApiKey } from "@run402/database";
import { newId } from "@run402/utils";
import { NotFoundError } from "@run402/utils/errors";
import { assertProjectOwnership, getProject } from "./projects";
import {
  generateSecretKey,
  hashSecretKey,
  previewSecretKey,
} from "@/lib/keys";

/** Client-safe key record (never includes the hash). */
export interface PublicApiKey {
  id: string;
  type: "publishable" | "secret";
  key: string; // full for publishable, masked preview for secret
  environment: "sandbox" | "live";
  lastUsed: Date | null;
  createdAt: Date;
}

const toPublic = (row: ApiKey): PublicApiKey => ({
  id: row.id,
  type: row.type,
  key: row.key,
  environment: row.environment,
  lastUsed: row.lastUsed,
  createdAt: row.createdAt,
});

export async function listApiKeys(
  userId: string,
  projectId: string,
): Promise<PublicApiKey[]> {
  await assertProjectOwnership(userId, projectId);

  const rows = await db
    .select()
    .from(schema.apiKey)
    .where(eq(schema.apiKey.projectId, projectId))
    .orderBy(asc(schema.apiKey.type));

  if (rows.length > 0) return rows.map(toPublic);

  // Legacy fallback: derive display rows from the project's own key columns.
  const project = await getProject(userId, projectId);
  return [
    {
      id: `${project.id}-pub`,
      type: "publishable",
      key: project.publishableKey,
      environment: "sandbox",
      lastUsed: null,
      createdAt: project.createdAt,
    },
    {
      id: `${project.id}-sec`,
      type: "secret",
      key: project.secretKeyPreview,
      environment: "sandbox",
      lastUsed: null,
      createdAt: project.createdAt,
    },
  ];
}

export interface RegenerateResult {
  key: PublicApiKey;
  /** Plaintext secret — surfaced to the user exactly once. */
  secretKey: string;
}

/** Rotate the sandbox secret key. Updates both the project row and api_key. */
export async function regenerateSecretKey(
  userId: string,
  projectId: string,
): Promise<RegenerateResult> {
  await assertProjectOwnership(userId, projectId);

  const secret = generateSecretKey();
  const secretKeyHash = hashSecretKey(secret);
  const secretKeyPreview = previewSecretKey(secret);

  const key = await db.transaction(async (tx) => {
    await tx
      .update(schema.project)
      .set({ secretKeyHash, secretKeyPreview, updatedAt: new Date() })
      .where(eq(schema.project.id, projectId));

    const updated = await tx
      .update(schema.apiKey)
      .set({ key: secretKeyPreview, keyHash: secretKeyHash, lastUsed: null })
      .where(
        and(
          eq(schema.apiKey.projectId, projectId),
          eq(schema.apiKey.type, "secret"),
          eq(schema.apiKey.environment, "sandbox"),
        ),
      )
      .returning();

    if (updated[0]) return updated[0];

    // No structured row yet (legacy project) — create one.
    const inserted = await tx
      .insert(schema.apiKey)
      .values({
        id: newId("apiKey"),
        projectId,
        type: "secret",
        key: secretKeyPreview,
        keyHash: secretKeyHash,
        environment: "sandbox",
      })
      .returning();
    return inserted[0];
  });

  if (!key) throw new NotFoundError("Project not found");
  return { key: toPublic(key), secretKey: secret };
}
