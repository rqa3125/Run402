"use client";

import * as React from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Button, Label } from "@run402/ui";

/** Read-only key display with copy and optional show/hide (for secrets). */
export function KeyField({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const [revealed, setRevealed] = React.useState(!secret);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-xs">
          {revealed ? value : "•".repeat(Math.min(value.length, 32))}
        </code>
        {secret && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={revealed ? "Hide" : "Reveal"}
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Copy"
          onClick={copy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
