"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Card with a cursor-following radial highlight and a natural spring lift.
 * The spotlight is a masked overlay driven by CSS vars updated on pointer move,
 * so it costs no React re-renders.
 */
export function SpotlightCard({
  children,
  className,
  variants,
  lift = -6,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  lift?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      variants={variants}
      whileHover={{ y: lift }}
      transition={springSoft}
      className={cn("group/spot relative", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx) var(--my), hsl(var(--foreground) / 0.06), transparent 65%)",
        }}
      />
      {children}
    </motion.div>
  );
}
