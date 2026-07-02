"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  cn,
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
} from "@run402/ui";
import { SearchInput } from "@/components/dashboard/search-input";

export interface LogRow {
  id: string;
  time: string;
  method: string;
  path: string;
  statusCode: number;
  paymentStatus: string;
  durationMs: number;
}

const paymentVariant: Record<string, "success" | "secondary" | "warning"> = {
  paid: "success",
  unpaid: "secondary",
  expired: "warning",
  error: "warning",
};

type StatusFilter = "all" | "2xx" | "402" | "error";

export function LogsView({ logs }: { logs: LogRow[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");

  const filtered = logs.filter((l) => {
    const q = query.trim().toLowerCase();
    if (q && !`${l.method} ${l.path} ${l.paymentStatus}`.toLowerCase().includes(q)) {
      return false;
    }
    if (status === "2xx") return l.statusCode < 300;
    if (status === "402") return l.statusCode === 402;
    if (status === "error") return l.statusCode >= 400 && l.statusCode !== 402;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Logs</h2>
          <p className="text-sm text-muted-foreground">
            Every request that hit the middleware, newest first.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search logs…"
          className="max-w-xs flex-1"
        />
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="2xx">2xx success</SelectItem>
            <SelectItem value="402">402 payment</SelectItem>
            <SelectItem value="error">4xx / 5xx errors</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {logs.length}
        </span>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {log.time}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <span className="text-muted-foreground">{log.method}</span> {log.path}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded px-1.5 py-0.5 font-mono text-xs font-semibold",
                      log.statusCode < 300 && "bg-emerald-500/10 text-emerald-600",
                      log.statusCode === 402 && "bg-orange-500/10 text-orange-600",
                      log.statusCode >= 400 &&
                        log.statusCode !== 402 &&
                        "bg-red-500/10 text-red-600",
                    )}
                  >
                    {log.statusCode}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={paymentVariant[log.paymentStatus] ?? "secondary"}>
                    {log.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {log.durationMs} ms
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No logs match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
