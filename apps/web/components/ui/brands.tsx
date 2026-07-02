import * as React from "react";

/**
 * Simplified, monochrome brand glyphs (currentColor). Deliberately minimal —
 * recognizable silhouettes rather than pixel-perfect trademarks.
 */
type IconProps = { className?: string };

export const StripeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 60 25" fill="currentColor" className={className} aria-hidden>
    <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.03 1.26-.06 1.48Zm-8.1-2.9h4.29c0-1.85-1.05-2.62-2.11-2.62-1.09 0-2.14.76-2.18 2.62ZM40.95 5.3l3.94-.84v3.19l-3.94.84V5.3Zm0 3.72h3.94v11.06h-3.94V9.02ZM36.7 9.02h3.79l.24 1.32c.98-1.4 2.9-1.53 3.98-1.16v3.63c-1.04-.34-2.65-.53-3.63.23v7.34h-3.94V9.02h-.44Zm-6.9-.35c1.44 0 2.4.68 2.93 1.15l.18-.91h3.47v11.4c0 3.6-2.29 5.05-5.62 5.05-1.4 0-2.83-.27-3.85-.72v-3.35c.94.5 2.13.87 3.35.87 1.6 0 2.16-.75 2.16-2.02v-.5c-.55.49-1.47 1.06-2.86 1.06-2.62 0-4.68-2.28-4.68-6.05 0-3.68 2.09-6 4.94-6Zm.8 8.6c1.28 0 1.98-.75 1.98-2.55v-.16c0-1.79-.71-2.55-1.98-2.55-1.28 0-2 .76-2 2.55v.16c0 1.8.72 2.55 2 2.55ZM23.5 5.3v3.72h2.9v3.2h-2.9v4.16c0 1.25.52 1.62 1.4 1.62.62 0 1.15-.14 1.5-.28v3.24c-.4.22-1.3.45-2.42.45-2.5 0-4.32-1.28-4.32-4.4v-4.79h-1.86v-3.2h1.86l.44-3.4 3.4-.34ZM10 12.8c0-.6.5-.84 1.32-.84 1.18 0 2.67.36 3.85 1v-3.6c-1.29-.5-2.56-.7-3.85-.7C8.14 8.66 6 10.3 6 13.05c0 4.3 5.9 3.6 5.9 5.45 0 .72-.62.95-1.5.95-1.28 0-2.93-.53-4.24-1.24v3.65c1.45.62 2.92.88 4.24.88 3.36 0 5.66-1.6 5.66-4.4 0-4.63-5.96-3.8-5.96-5.53Z" />
  </svg>
);

export const VercelIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2 22 20H2L12 2Z" />
  </svg>
);

export const NextIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 8v8M8 8l8 10M16 8v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const NodeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9.5 14.2c0 1 .7 1.6 2.3 1.6 1.5 0 2.4-.6 2.4-1.7 0-1-.6-1.4-2-1.6-1.5-.2-1.9-.4-1.9-1s.5-1 1.5-1c1 0 1.6.4 1.7 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const GitHubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.23.72-.5v-1.9c-2.94.64-3.56-1.26-3.56-1.26-.48-1.22-1.17-1.55-1.17-1.55-.96-.66.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.35-.27-4.82-1.18-4.82-5.23 0-1.16.41-2.1 1.09-2.84-.11-.27-.47-1.35.1-2.8 0 0 .89-.29 2.9 1.08a10 10 0 0 1 5.28 0c2.01-1.37 2.9-1.08 2.9-1.08.57 1.45.21 2.53.1 2.8.68.74 1.09 1.68 1.09 2.84 0 4.06-2.48 4.95-4.84 5.22.38.33.72.98.72 1.98v2.93c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
  </svg>
);

export const CloudflareIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M7 17h10.2a3.3 3.3 0 0 0 .3-6.58 4.5 4.5 0 0 0-8.6-1.2A3.5 3.5 0 0 0 7 17Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const SupabaseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M13.4 22.4c-.6.75-1.8.34-1.8-.62l-.02-7.1H4.3c-1.06 0-1.66-1.24-1-2.07L11.1 1.6c.6-.75 1.8-.34 1.8.62l.02 7.1h7.28c1.06 0 1.66 1.24 1 2.07l-7.8 11Z" />
  </svg>
);

export const DockerIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M4 9.5h2.4v2.4H4V9.5Zm2.9 0h2.4v2.4H6.9V9.5Zm2.9 0h2.4v2.4H9.8V9.5Zm2.9 0h2.4v2.4h-2.4V9.5ZM6.9 6.7h2.4V9H6.9V6.7Zm2.9 0h2.4V9H9.8V6.7Zm2.9 0h2.4V9h-2.4V6.7ZM9.8 4h2.4v2.3H9.8V4Zm11.9 6.3c-.5-.35-1.6-.47-2.5-.3-.12-.83-.58-1.56-1.4-2.2l-.5-.33-.32.5c-.42.66-.56 1.75-.1 2.5H2c-.2 1.9.35 3.86 1.7 5.16C5.1 18.4 7.2 19 9.5 19c4.9 0 8.6-2.24 10.3-6.35.9.04 2.4.02 3.2-1.5-.04-.05-.6-.5-1.3-.85Z" />
  </svg>
);

export const ExpressIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="m5 7 5 5-5 5M11 17h8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FastifyIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="m2 8 10-4 10 4-10 3L2 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M6 10.5V14c0 1.5 2.7 3 6 3s6-1.5 6-3v-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M22 8v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export type Brand = { name: string; Icon: React.FC<IconProps> };

export const brands: Brand[] = [
  { name: "Stripe", Icon: StripeIcon },
  { name: "Express", Icon: ExpressIcon },
  { name: "Next.js", Icon: NextIcon },
  { name: "Node.js", Icon: NodeIcon },
  { name: "Fastify", Icon: FastifyIcon },
  { name: "Cloudflare", Icon: CloudflareIcon },
  { name: "Supabase", Icon: SupabaseIcon },
  { name: "Docker", Icon: DockerIcon },
  { name: "GitHub", Icon: GitHubIcon },
  { name: "Vercel", Icon: VercelIcon },
];
