import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  ExplorerView,
  type ExplorerData,
} from "@/components/explorer/explorer-view";
import { requireUser } from "@/lib/auth";
import { listProjects } from "@/lib/data/projects";
import { listEndpoints } from "@/lib/data/endpoints";
import { listRequestLogs } from "@/lib/data/logs";
import { listPayments, listPaymentTokens } from "@/lib/data/explorer";

export const metadata: Metadata = { title: "API Explorer" };

/** Dates → ISO strings so rows serialize cleanly to the client. */
function serialize<T extends object>(row: T): Record<string, string | number | null> {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [
      k,
      v instanceof Date ? v.toISOString() : (v as string | number | null),
    ]),
  );
}

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: requested } = await searchParams;
  const user = await requireUser();
  const projects = await listProjects(user.id);

  if (projects.length === 0) {
    return (
      <>
        <PageHeader
          title="API Explorer"
          description="Inspect the raw records behind your integration."
        />
        <EmptyState
          icon={FolderKanban}
          title="Nothing to explore yet"
          description="Create a project and the explorer will show its endpoints, payments, tokens, and requests."
        />
      </>
    );
  }

  const selected =
    projects.find((p) => p.id === requested) ?? projects[0]!;

  const [endpoints, payments, tokens, logs] = await Promise.all([
    listEndpoints(user.id, selected.id),
    listPayments(user.id, selected.id),
    listPaymentTokens(user.id, selected.id),
    listRequestLogs(user.id, selected.id, 50),
  ]);

  const data: ExplorerData = {
    projects: projects.map((p) => ({ id: p.id, name: p.name })),
    selectedId: selected.id,
    project: serialize(selected),
    endpoints: endpoints.map(serialize),
    payments: payments.map(serialize),
    tokens: tokens.map(serialize),
    logs: logs.map(serialize),
  };

  return (
    <>
      <PageHeader
        title="API Explorer"
        description="Inspect projects, endpoints, payments, tokens, and requests — read-only."
      />
      <ExplorerView data={data} />
    </>
  );
}
