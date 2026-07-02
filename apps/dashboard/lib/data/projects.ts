import { and, db, desc, eq, schema, type Project } from "@run402/database";
import { newId } from "@run402/utils";
import { NotFoundError } from "@run402/utils/errors";
import { generateProjectKeys, hashSecretKey } from "@/lib/keys";
import { dollarsToMicros } from "@/lib/format";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/validations/project";

/**
 * Projects data-access layer. Every query is scoped by `userId` for ownership
 * isolation. Routes/server code call these functions; they never touch Drizzle
 * directly, and the `secretKeyHash` column is never selected into responses.
 */

/** Columns safe to return to the client (no secret hash). */
const publicColumns = {
  id: schema.project.id,
  userId: schema.project.userId,
  name: schema.project.name,
  description: schema.project.description,
  publishableKey: schema.project.publishableKey,
  secretKeyPreview: schema.project.secretKeyPreview,
  currency: schema.project.currency,
  pricePerRequest: schema.project.pricePerRequest,
  status: schema.project.status,
  createdAt: schema.project.createdAt,
  updatedAt: schema.project.updatedAt,
} as const;

export type PublicProject = Omit<Project, "secretKeyHash">;

export async function listProjects(userId: string): Promise<PublicProject[]> {
  return db
    .select(publicColumns)
    .from(schema.project)
    .where(eq(schema.project.userId, userId))
    .orderBy(desc(schema.project.createdAt));
}

/** Fetch a single project, enforcing ownership. Throws if not found/owned. */
export async function getProject(
  userId: string,
  projectId: string,
): Promise<PublicProject> {
  const rows = await db
    .select(publicColumns)
    .from(schema.project)
    .where(and(eq(schema.project.id, projectId), eq(schema.project.userId, userId)))
    .limit(1);

  const project = rows[0];
  if (!project) throw new NotFoundError("Project not found");
  return project;
}

/**
 * Assert the user owns the project. Used by the endpoints/keys data layers
 * before any project-scoped mutation so ownership is enforced everywhere.
 */
export async function assertProjectOwnership(
  userId: string,
  projectId: string,
): Promise<void> {
  const rows = await db
    .select({ id: schema.project.id })
    .from(schema.project)
    .where(and(eq(schema.project.id, projectId), eq(schema.project.userId, userId)))
    .limit(1);
  if (!rows[0]) throw new NotFoundError("Project not found");
}

/**
 * Resolve a project from either its secret key (`sk_…`, hashed match) or its
 * publishable key (`pk_…`). Used by the control-plane (verify + CLI) endpoints
 * which are authenticated by the key, not a session.
 */
export async function getProjectByKey(key: string): Promise<Project | undefined> {
  const column = key.startsWith("sk_")
    ? { col: schema.project.secretKeyHash, value: hashSecretKey(key) }
    : { col: schema.project.publishableKey, value: key };
  return (
    await db.select().from(schema.project).where(eq(column.col, column.value)).limit(1)
  )[0];
}

export interface CreateProjectResult {
  project: PublicProject;
  /** Plaintext secret — surfaced to the user exactly once. */
  secretKey: string;
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<CreateProjectResult> {
  const keys = generateProjectKeys();
  const projectId = newId("project");

  const project = await db.transaction(async (tx) => {
    const rows = await tx
      .insert(schema.project)
      .values({
        id: projectId,
        userId,
        name: input.name,
        description: input.description ?? null,
        publishableKey: keys.publishableKey,
        secretKeyHash: keys.secretKeyHash,
        secretKeyPreview: keys.secretKeyPreview,
        currency: input.currency,
        pricePerRequest: dollarsToMicros(input.pricePerRequest),
        status: "active",
      })
      .returning(publicColumns);

    // Seed the structured sandbox key records for the API Keys UI.
    await tx.insert(schema.apiKey).values([
      {
        id: newId("apiKey"),
        projectId,
        type: "publishable",
        key: keys.publishableKey,
        environment: "sandbox",
      },
      {
        id: newId("apiKey"),
        projectId,
        type: "secret",
        key: keys.secretKeyPreview,
        keyHash: keys.secretKeyHash,
        environment: "sandbox",
      },
    ]);

    return rows[0];
  });

  if (!project) throw new Error("Insert returned no rows");
  return { project, secretKey: keys.secretKey };
}

export async function updateProject(
  userId: string,
  projectId: string,
  input: UpdateProjectInput,
): Promise<PublicProject> {
  const rows = await db
    .update(schema.project)
    .set({
      name: input.name,
      description: input.description ?? null,
      currency: input.currency,
      pricePerRequest: dollarsToMicros(input.pricePerRequest),
      updatedAt: new Date(),
    })
    .where(and(eq(schema.project.id, projectId), eq(schema.project.userId, userId)))
    .returning(publicColumns);

  const project = rows[0];
  if (!project) throw new NotFoundError("Project not found");
  return project;
}

export async function deleteProject(
  userId: string,
  projectId: string,
): Promise<void> {
  const rows = await db
    .delete(schema.project)
    .where(and(eq(schema.project.id, projectId), eq(schema.project.userId, userId)))
    .returning({ id: schema.project.id });
  if (!rows[0]) throw new NotFoundError("Project not found");
}
