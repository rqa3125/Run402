import { apiHandler } from "@/lib/api/handler";
import { created, ok } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth";
import { createEndpoint, listEndpoints } from "@/lib/data/endpoints";
import { createEndpointSchema } from "@/lib/validations/endpoint";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/v1/projects/:id/endpoints — list endpoints. */
export const GET = apiHandler<Ctx>(async (_req, _api, ctx) => {
  const userId = await requireUserId();
  const { id } = await ctx.params;
  const items = await listEndpoints(userId, id);
  return ok({ items });
});

/** POST /api/v1/projects/:id/endpoints — create an endpoint. */
export const POST = apiHandler<Ctx>(async (req, api, ctx) => {
  const userId = await requireUserId();
  const { id } = await ctx.params;
  const input = createEndpointSchema.parse(await req.json());
  const endpoint = await createEndpoint(userId, id, input);
  api.log.info({ projectId: id, endpointId: endpoint.id }, "endpoint created");
  return created({ endpoint });
});
