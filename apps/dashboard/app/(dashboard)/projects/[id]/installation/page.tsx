import type { Metadata } from "next";
import { InstallationTabs } from "@/components/projects/installation-tabs";
import { requireUser } from "@/lib/auth";
import { listEndpoints } from "@/lib/data/endpoints";

export const metadata: Metadata = { title: "Installation" };

export default async function InstallationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const endpoints = await listEndpoints(user.id, id);
  const samplePath = endpoints[0]?.path ?? "/api/premium";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Installation</h2>
        <p className="text-sm text-muted-foreground">
          Install the SDK and protect a route in your framework of choice.
        </p>
      </div>
      <InstallationTabs projectId={id} samplePath={samplePath} />
    </div>
  );
}
