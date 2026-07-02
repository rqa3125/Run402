"use client";

import * as React from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  compact?: boolean;
  className?: string;
};

function format(n: number, decimals: number, compact?: boolean) {
  if (compact) {
    if (n >= 1_000_000_000)
      return `${(n / 1_000_000_000).toFixed(decimals)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  compact = false,
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (inView) mv.set(reduce ? value : value);
  }, [inView, value, mv, reduce]);

  React.useEffect(() => {
    if (reduce) {
      setDisplay(format(value, decimals, compact));
      return;
    }
    return spring.on("change", (latest) => {
      setDisplay(format(latest, decimals, compact));
    });
  }, [spring, decimals, compact, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
