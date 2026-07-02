import * as React from "react";
import { cn } from "@/lib/utils";
import { Highlight } from "./highlight";
import { CopyButton } from "./copy-button";

export function WindowDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-full bg-border" />
      <span className="h-3 w-3 rounded-full bg-border" />
      <span className="h-3 w-3 rounded-full bg-border" />
    </div>
  );
}

export function CodeBlock({
  code,
  lang = "ts",
  filename,
  className,
  showCopy = true,
}: {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
  showCopy?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-soft",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <WindowDots />
          {filename && (
            <span className="font-mono text-xs text-muted-foreground">
              {filename}
            </span>
          )}
        </div>
        {showCopy && <CopyButton value={code} />}
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.75]">
        <code>
          <Highlight code={code} lang={lang} />
        </code>
      </pre>
    </div>
  );
}
