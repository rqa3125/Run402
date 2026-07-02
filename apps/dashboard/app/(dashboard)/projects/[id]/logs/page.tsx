import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LogsView, type LogRow } from "@/components/projects/logs-view";
import { requireUser } from "@/lib/auth";
import { listRequestLogs } from "@/lib/data/logs";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Logs" };

export default async function LogsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const logs = await listRequestLogs(user.id, id);

  if (logs.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Logs</h2>
          <p className="text-sm text-muted-foreground">
            Requests to your protected endpoints.
          </p>
        </div>
        <EmptyState
          icon={ScrollText}
          title="No requests yet"
          description="Send a request from the Playground, or protect a route with the SDK, and every request will appear here with its payment outcome."
        />
      </div>
    );
  }

  const rows: LogRow[] = logs.map((l) => ({
    id: l.id,
    time: formatDateTime(l.createdAt),
    method: l.method,
    path: l.path,
    statusCode: l.statusCode,
    paymentStatus: l.paymentStatus,
    durationMs: l.durationMs,
  }));

  return <LogsView logs={rows} />;
}
