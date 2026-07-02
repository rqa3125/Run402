"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Mouse parallax layer. `depth` controls how far it drifts (px at screen edge).
 * Positive depth moves with the cursor; the container measures pointer offset
 * from its own center, so nested layers feel cohesive.
 */
export function Parallax({
  children,
  depth = 12,
  className,
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  React.useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (window.innerWidth / 2);
      const ny = (e.clientY - cy) / (window.innerHeight / 2);
      x.set(nx * depth);
      y.set(ny * depth);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [depth, reduce, x, y]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}
