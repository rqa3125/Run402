"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  RefreshCw,
} from "lucide-react";
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
  CardContent,
  CopyButton,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from "@run402/ui";
import type { PublicApiKey } from "@/lib/data/api-keys";
import { SearchInput } from "@/components/dashboard/search-input";
import { markOnboarding } from "@/lib/onboarding";
import { formatDate } from "@/lib/format";

export function ApiKeysPanel({
  projectId,
  keys,
}: {
  projectId: string;
  keys: PublicApiKey[];
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [confirmRegen, setConfirmRegen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [revealedSecret, setRevealedSecret] = React.useState<string | null>(null);

  const regenerate = async () => {
    setBusy(true);
    const res = await fetch(`/api/v1/projects/${projectId}/keys/regenerate`, {
      method: "POST",
    });
    setBusy(false);
    setConfirmRegen(false);
    if (!res.ok) {
      toast.error("Failed to regenerate secret key");
      return;
    }
    const data = (await res.json()) as { secretKey: string };
    setRevealedSecret(data.secretKey);
    toast.success("Secret key regenerated");
    router.refresh();
  };

  const sandbox = keys.filter((k) => k.environment === "sandbox");
  const filtered = sandbox.filter((k) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${k.type} ${k.key} ${k.environment}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">API keys</h2>
        <p className="text-sm text-muted-foreground">
          Authenticate SDK and middleware traffic.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Keep your <strong>secret key</strong> safe. Never expose it in
          client-side code, commit it to version control, or share it. Rotate it
          immediately if it leaks.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search keys…"
          className="max-w-xs"
        />
        <Badge variant="secondary">Sandbox</Badge>
      </div>

      <div className="space-y-3">
        {filtered.map((key) => (
          <KeyRow
            key={key.id}
            apiKey={key}
            projectId={projectId}
            onRegenerate={() => setConfirmRegen(true)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No keys match “{query}”.
          </p>
        )}
      </div>

      {/* Live keys — disabled until Sprint 4 */}
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 py-5 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Live keys</p>
            <p>Available once you enable live mode.</p>
          </div>
          <Badge variant="secondary">Coming soon</Badge>
        </CardContent>
      </Card>

      {/* Regenerate confirmation */}
      <AlertDialog open={confirmRegen} onOpenChange={setConfirmRegen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate secret key?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current secret key will stop working immediately. Any
              integration using it must be updated with the new key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={regenerate}
              disabled={busy}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* One-time reveal of the new secret */}
      <Dialog open={Boolean(revealedSecret)} onOpenChange={(o) => !o && setRevealedSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your new secret key</DialogTitle>
            <DialogDescription>
              This is the only time we&apos;ll show it in full.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
            <code className="flex-1 truncate font-mono text-xs">{revealedSecret}</code>
            <CopyButton
              value={revealedSecret ?? ""}
              onCopied={() => markOnboarding(projectId, "copiedSecret")}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setRevealedSecret(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KeyRow({
  apiKey,
  projectId,
  onRegenerate,
}: {
  apiKey: PublicApiKey;
  projectId: string;
  onRegenerate: () => void;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const isSecret = apiKey.type === "secret";
  const label = isSecret ? "Secret key" : "Publishable key";
  const display = isSecret && !revealed ? "•".repeat(28) : apiKey.key;

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{label}</span>
            {isSecret && (
              <Badge variant="warning" className="gap-1">
                <Lock className="h-2.5 w-2.5" /> Secret
              </Badge>
            )}
          </div>
          {isSecret && (
            <Button variant="ghost" size="sm" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-xs">
            {display}
          </code>
          {isSecret && (
            <Button
              variant="outline"
              size="icon"
              aria-label={revealed ? "Hide" : "Reveal"}
              onClick={() => setRevealed((v) => !v)}
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <CopyButton
            value={apiKey.key}
            onCopied={
              isSecret ? () => markOnboarding(projectId, "copiedSecret") : undefined
            }
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Created {formatDate(apiKey.createdAt)}</span>
          <span>·</span>
          <span>Last used {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}</span>
          {isSecret && (
            <span className="ml-auto italic">Full secret shown once at creation.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
