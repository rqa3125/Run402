import { apiHandler } from "@/lib/api/handler";
import { created, ok } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth";
import { createProject, listProjects } from "@/lib/data/projects";
import { createProjectSchema } from "@/lib/validations/project";

/** GET /api/v1/projects — list the current user's projects. */
export const GET = apiHandler(async () => {
  const userId = await requireUserId();
  const items = await listProjects(userId);
  return ok({ items });
});

/**
 * POST /api/v1/projects — create a project. The plaintext `secretKey` is
 * returned here and nowhere else; the client must show it to the user once.
 */
export const POST = apiHandler(async (req, api) => {
  const userId = await requireUserId();
  const input = createProjectSchema.parse(await req.json());

  const { project, secretKey } = await createProject(userId, input);
  api.log.info({ projectId: project.id }, "project created");

  return created({ project, secretKey });
});
