"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Copy, MoreHorizontal, Pencil, Plus, Trash2, Webhook } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@run402/ui";
import type { Endpoint } from "@run402/database";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SearchInput } from "@/components/dashboard/search-input";
import { EndpointDialog } from "./endpoint-dialog";
import { formatPrice } from "@/lib/format";

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-600",
  POST: "bg-emerald-500/10 text-emerald-600",
  PUT: "bg-amber-500/10 text-amber-600",
  PATCH: "bg-violet-500/10 text-violet-600",
  DELETE: "bg-red-500/10 text-red-600",
};

export function EndpointsManager({
  projectId,
  endpoints,
}: {
  projectId: string;
  endpoints: Endpoint[];
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Endpoint | null>(null);
  const [deleting, setDeleting] = React.useState<Endpoint | null>(null);
  const [busy, setBusy] = React.useState(false);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (ep: Endpoint) => {
    setEditing(ep);
    setDialogOpen(true);
  };

  const duplicate = async (ep: Endpoint) => {
    setBusy(true);
    const res = await fetch(
      `/api/v1/projects/${projectId}/endpoints/${ep.id}/duplicate`,
      { method: "POST" },
    );
    setBusy(false);
    if (!res.ok) {
      toast.error("Failed to duplicate endpoint");
      return;
    }
    toast.success("Endpoint duplicated");
    router.refresh();
  };

  const doDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const res = await fetch(
      `/api/v1/projects/${projectId}/endpoints/${deleting.id}`,
      { method: "DELETE" },
    );
    setBusy(false);
    setDeleting(null);
    if (!res.ok) {
      toast.error("Failed to delete endpoint");
      return;
    }
    toast.success("Endpoint deleted");
    router.refresh();
  };

  const filtered = endpoints.filter((e) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${e.method} ${e.path} ${e.name}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Endpoints</h2>
          <p className="text-sm text-muted-foreground">
            Routes protected by Run402.
          </p>
        </div>
        {endpoints.length > 0 && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Create endpoint
          </Button>
        )}
      </div>

      {endpoints.length === 0 ? (
        <EmptyState
          icon={Webhook}
          title="Protect your first endpoint"
          description="Register a route and price to start monetizing it with Run402."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Create endpoint
            </Button>
          }
        />
      ) : (
        <>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search endpoints…"
            className="max-w-sm"
          />
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Method</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ep) => (
                  <TableRow key={ep.id}>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded px-2 py-0.5 font-mono text-xs font-semibold",
                          METHOD_STYLES[ep.method],
                        )}
                      >
                        {ep.method}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{ep.path}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(ep.price, "usd")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ep.environment}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ep.status === "active" ? "success" : "secondary"}>
                        {ep.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={busy}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(ep)}>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicate(ep)}>
                            <Copy className="h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleting(ep)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      No endpoints match “{query}”.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <EndpointDialog
        projectId={projectId}
        endpoint={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete endpoint?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && (
                <>
                  <span className="font-mono">
                    {deleting.method} {deleting.path}
                  </span>{" "}
                  will be permanently removed. This can&apos;t be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={doDelete}
              disabled={busy}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
