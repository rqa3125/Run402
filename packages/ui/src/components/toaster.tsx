"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

/** App-wide toast host. Drop `<Toaster />` once near the root layout. */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !text-card-foreground !border-border !rounded-lg !shadow-lg",
          description: "!text-muted-foreground",
        },
      }}
    />
  );
}

export { toast };
