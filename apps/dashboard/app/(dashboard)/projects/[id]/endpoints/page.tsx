import type { Metadata } from "next";
import { EndpointsManager } from "@/components/projects/endpoints-manager";
import { requireUser } from "@/lib/auth";
import { listEndpoints } from "@/lib/data/endpoints";

export const metadata: Metadata = { title: "Endpoints" };

export default async function EndpointsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const endpoints = await listEndpoints(user.id, id);

  return <EndpointsManager projectId={id} endpoints={endpoints} />;
}
