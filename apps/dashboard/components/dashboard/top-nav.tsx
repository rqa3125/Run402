import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "./search-bar";
import { Notifications } from "./notifications";

/**
 * Sticky top bar. Left: workspace identity. Center: search (UI). Right:
 * notifications, theme toggle, and Clerk's user button (account + sign out).
 */
export function TopNav({ user }: { user: { name: string } }) {
  const workspace = `${user.name.split(" ")[0] ?? "Personal"}'s workspace`;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
          {(user.name[0] ?? "R").toUpperCase()}
        </span>
        <span className="truncate text-sm font-medium">{workspace}</span>
      </div>

      <div className="ml-auto flex flex-1 justify-end sm:ml-6 sm:justify-center">
        <SearchBar />
      </div>

      <div className="flex items-center gap-1.5">
        <Notifications />
        <ThemeToggle />
        <UserButton
          appearance={{ elements: { avatarBox: "h-8 w-8" } }}
        />
      </div>
    </header>
  );
}
