"use client";

import * as React from "react";
import { Button } from "@run402/ui";

/** Route-segment error boundary. Renders inside the app shell. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Client-side error reporting hook (PostHog/Sentry) goes here.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          An unexpected error occurred
        </h1>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            ref: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
