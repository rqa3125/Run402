"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";

/**
 * Client providers: theme + product analytics. PostHog only initializes when a
 * key is configured, so local/dev without analytics just works.
 */
function usePostHog() {
  React.useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: true,
      person_profiles: "identified_only",
    });
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  usePostHog();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
