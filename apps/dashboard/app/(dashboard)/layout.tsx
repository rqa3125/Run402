import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { CommandMenu } from "@/components/dashboard/command-menu";
import { requireUser } from "@/lib/auth";

/**
 * Protected shell for the entire app area. Clerk middleware guards these
 * routes; `requireUser` provides the profile and redirects to /sign-in if the
 * session is somehow absent (defense in depth).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav user={{ name: user.name }} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <CommandMenu />
    </div>
  );
}
