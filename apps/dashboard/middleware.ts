import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Run402 control-plane + mock checkout are authenticated by project key /
  // payment capability, not by a Clerk session.
  "/api/run402(.*)",
  "/mock-checkout(.*)",
  "/api/health",
]);

// Clerk's keys are inlined/read at build & runtime. A missing or malformed pair
// is the usual cause of an opaque `MIDDLEWARE_INVOCATION_FAILED` (the whole edge
// function throws before any page renders). Detect it up front so we can log a
// readable reason and keep public routes alive instead of blanking the site.
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkConfigured =
  Boolean(publishableKey?.startsWith("pk_")) &&
  Boolean(secretKey?.startsWith("sk_"));

if (!clerkConfigured) {
  console.error(
    "[middleware] Clerk is not configured correctly — auth is disabled. " +
      `publishableKey=${publishableKey ? "present" : "MISSING"}, ` +
      `secretKey=${secretKey ? "present" : "MISSING"}. ` +
      "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_…) and CLERK_SECRET_KEY (sk_…) " +
      "as a matched pair from the SAME Clerk instance, then redeploy with the " +
      "build cache disabled (the publishable key is baked in at build time).",
  );
}

// Clerk/Next signal redirects and not-found via a thrown value carrying a
// `digest`. Those are normal control flow — never swallow them.
function isControlFlowSignal(err: unknown): boolean {
  const digest = (err as { digest?: unknown })?.digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest === "NEXT_NOT_FOUND")
  );
}

const clerk = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // No usable auth config: public routes still work; protected routes get a
  // clear 503 rather than crashing the entire edge runtime.
  if (!clerkConfigured) {
    if (isPublicRoute(request)) return NextResponse.next();
    return new NextResponse(
      "Authentication is unavailable: Clerk keys are missing or malformed in " +
        "the server environment.",
      { status: 503, headers: { "content-type": "text/plain" } },
    );
  }

  try {
    return await clerk(request, event);
  } catch (err) {
    if (isControlFlowSignal(err)) throw err; // real redirect / not-found
    // Present-but-rejected keys (mismatched pair, or live keys on the wrong
    // domain) land here. Log the actual reason and don't take down public pages.
    console.error("[middleware] Clerk rejected the request:", err);
    if (isPublicRoute(request)) return NextResponse.next();
    return new NextResponse(
      "Authentication is temporarily unavailable. Verify the Clerk keys match " +
        "this deployment's instance and domain.",
      { status: 503, headers: { "content-type": "text/plain" } },
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
