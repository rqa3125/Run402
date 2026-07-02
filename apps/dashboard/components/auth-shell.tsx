import Link from "next/link";

/** Centered, branded wrapper for Clerk's SignIn / SignUp components. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          R
        </span>
        Run402
      </Link>
      {children}
    </div>
  );
}
