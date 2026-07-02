import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UnauthorizedError } from "@run402/utils/errors";

/**
 * Clerk-backed auth helpers for server components, route handlers and actions.
 * Clerk middleware already guards protected routes, but these helpers give us
 * the typed user id / profile and defend in depth.
 */

export interface AppUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/** Current Clerk user id, or null when signed out. */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/** User id or throw — for API routes (serialized by `apiHandler`). */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();
  return userId;
}

/** Normalized profile for server components; redirects to sign-in if absent. */
export async function requireUser(): Promise<AppUser> {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return {
    id: user.id,
    name:
      user.fullName ??
      user.firstName ??
      user.username ??
      user.primaryEmailAddress?.emailAddress ??
      "User",
    email: user.primaryEmailAddress?.emailAddress ?? "",
    image: user.imageUrl ?? null,
  };
}
