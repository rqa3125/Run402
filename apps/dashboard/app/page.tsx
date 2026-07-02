import { redirect } from "next/navigation";

/**
 * Entry point. Clerk middleware protects the app, so an unauthenticated
 * visitor is redirected to /sign-in before reaching /dashboard.
 */
export default function RootPage() {
  redirect("/dashboard");
}
