"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Shape = {
  className: string;
  duration: number;
  delay?: number;
  drift?: number;
};

/**
 * Slow, low-contrast floating orbs for section backgrounds. Deliberately
 * subtle — they read as ambient depth, never decoration.
 */
export function FloatingShapes({
  shapes,
  className,
}: {
  shapes: Shape[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {shapes.map((s, i) => (
        <motion.span
          key={i}
          className={cn("absolute rounded-full blur-3xl", s.className)}
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  y: [0, -(s.drift ?? 24), 0],
                  x: [0, (s.drift ?? 24) / 2, 0],
                }
          }
          transition={{
            opacity: { duration: 1.2 },
            y: {
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay ?? 0,
            },
            x: {
              duration: s.duration * 1.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay ?? 0,
            },
          }}
        />
      ))}
    </div>
  );
}
