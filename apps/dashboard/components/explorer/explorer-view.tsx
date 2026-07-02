"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Braces } from "lucide-react";
import {
  Badge,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@run402/ui";

/** Serialized rows — dates are pre-stringified server-side. */
type Row = Record<string, string | number | null>;

export interface ExplorerData {
  projects: { id: string; name: string }[];
  selectedId: string;
  project: Row | null;
  endpoints: Row[];
  payments: Row[];
  tokens: Row[];
  logs: Row[];
}

const TABS = [
  { id: "project", label: "Project" },
  { id: "endpoints", label: "Endpoints" },
  { id: "payments", label: "Payments" },
  { id: "tokens", label: "Tokens" },
  { id: "logs", label: "Requests" },
] as const;

export function ExplorerView({ data }: { data: ExplorerData }) {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={data.selectedId}
          onValueChange={(id) => router.push(`/explorer?project=${id}`)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {data.projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">read-only</Badge>
        <span className="text-xs text-muted-foreground">
          Raw records straight from the database — secrets and tokens masked.
        </span>
      </div>

      <Tabs defaultValue="project">
        <TabsList className="w-full justify-start overflow-x-auto">
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                {t.id === "project" ? "" : (data[t.id] as Row[]).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="project">
          {data.project ? (
            <JsonCard title={String(data.project.id)} data={data.project} open />
          ) : (
            <Empty label="No project selected." />
          )}
        </TabsContent>
        <TabsContent value="endpoints">
          <EntityTable
            rows={data.endpoints}
            columns={["id", "method", "path", "price", "environment", "status"]}
          />
        </TabsContent>
        <TabsContent value="payments">
          <EntityTable
            rows={data.payments}
            columns={["id", "endpointId", "amount", "status", "provider", "createdAt"]}
          />
        </TabsContent>
        <TabsContent value="tokens">
          <EntityTable
            rows={data.tokens}
            columns={["token", "paymentId", "status", "createdAt", "expiresAt"]}
          />
        </TabsContent>
        <TabsContent value="logs">
          <EntityTable
            rows={data.logs}
            columns={["method", "path", "statusCode", "paymentStatus", "durationMs", "createdAt"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const statusTone = (value: string): string => {
  if (["paid", "active", "valid", "200"].includes(value))
    return "bg-emerald-500/10 text-emerald-600";
  if (["pending", "402", "unpaid"].includes(value))
    return "bg-orange-500/10 text-orange-600";
  if (["expired", "revoked", "used", "disabled", "refunded"].includes(value))
    return "bg-muted text-muted-foreground";
  return "";
};

function EntityTable({ rows, columns }: { rows: Row[]; columns: string[] }) {
  if (rows.length === 0) return <Empty label="No records yet." />;
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((c) => (
              <TableHead key={c} className="whitespace-nowrap font-mono text-[11px]">
                {c}
              </TableHead>
            ))}
            <TableHead className="w-16 text-right">JSON</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={String(row.id ?? row.token ?? i)}>
              {columns.map((c) => {
                const value = String(row[c] ?? "—");
                const tone = statusTone(value);
                return (
                  <TableCell key={c} className="max-w-56 truncate font-mono text-xs">
                    {tone ? (
                      <span className={cn("rounded px-1.5 py-0.5 font-semibold", tone)}>
                        {value}
                      </span>
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-right">
                <details className="group relative">
                  <summary className="inline-flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                    <Braces className="h-3.5 w-3.5" />
                  </summary>
                  <div className="absolute right-0 z-20 mt-1 w-[26rem] max-w-[80vw]">
                    <pre className="max-h-72 overflow-auto rounded-lg border border-border bg-card p-3 text-left font-mono text-[11px] leading-relaxed shadow-lg">
                      {JSON.stringify(row, null, 2)}
                    </pre>
                  </div>
                </details>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function JsonCard({ title, data, open }: { title: string; data: Row; open?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <details open={open}>
        <summary className="cursor-pointer border-b border-border bg-muted/40 px-4 py-2.5 font-mono text-xs text-muted-foreground">
          {title}
        </summary>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </Card>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <Card className="border-dashed">
      <p className="py-12 text-center text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}
