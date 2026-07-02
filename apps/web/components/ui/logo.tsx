import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        className="fill-foreground"
      />
      <path
        d="M11 22V10h5.4c2.3 0 3.9 1.4 3.9 3.6 0 1.7-1 2.9-2.6 3.4L21 22h-3l-2-4.7h-2.2V22H11Z"
        className="fill-background"
      />
      <path d="M13.8 15.2h2.2c.9 0 1.5-.5 1.5-1.4s-.6-1.4-1.5-1.4h-2.2v2.8Z" className="fill-foreground" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight">
        Run<span className="text-muted-foreground">402</span>
      </span>
    </span>
  );
}
