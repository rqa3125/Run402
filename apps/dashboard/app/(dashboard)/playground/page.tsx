import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Playground,
  type PlaygroundProject,
} from "@/components/playground/playground";
import { requireUser } from "@/lib/auth";
import { listProjects } from "@/lib/data/projects";
import { listEndpoints } from "@/lib/data/endpoints";

export const metadata: Metadata = { title: "Playground" };

export default async function PlaygroundPage() {
  const user = await requireUser();
  const projects = await listProjects(user.id);

  const withEndpoints: PlaygroundProject[] = await Promise.all(
    projects.map(async (p) => ({
      id: p.id,
      name: p.name,
      publishableKey: p.publishableKey,
      endpoints: (await listEndpoints(user.id, p.id)).map((e) => ({
        id: e.id,
        method: e.method,
        path: e.path,
        name: e.name,
      })),
    })),
  );

  return (
    <>
      <PageHeader
        title="Playground"
        description="Run the full 402 → payment → 200 flow against your endpoints — no code required."
      />
      <Playground projects={withEndpoints} />
    </>
  );
}
