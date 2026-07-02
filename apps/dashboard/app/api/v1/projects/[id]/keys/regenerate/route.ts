import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth";
import { regenerateSecretKey } from "@/lib/data/api-keys";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/v1/projects/:id/keys/regenerate — rotate the sandbox secret key.
 * The new plaintext secret is returned once; only its hash is persisted.
 */
export const POST = apiHandler<Ctx>(async (_req, api, ctx) => {
  const userId = await requireUserId();
  const { id } = await ctx.params;
  const result = await regenerateSecretKey(userId, id);
  api.log.info({ projectId: id }, "secret key regenerated");
  return ok(result);
});
