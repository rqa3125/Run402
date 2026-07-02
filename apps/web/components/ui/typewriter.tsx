"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Types out a sequence of lines, then holds. Loops if `loop` is set.
 * Purely presentational — used for the hero terminal.
 */
export function Typewriter({
  lines,
  className,
  speed = 34,
  startDelay = 400,
  loop = false,
}: {
  lines: { text: string; className?: string }[];
  className?: string;
  speed?: number;
  startDelay?: number;
  loop?: boolean;
}) {
  const reduce = useReducedMotion();
  const [rendered, setRendered] = React.useState<string[]>(
    reduce ? lines.map((l) => l.text) : []
  );
  const [done, setDone] = React.useState(reduce);

  React.useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const push = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const play = () => {
      setRendered([]);
      setDone(false);
      let delay = startDelay;
      lines.forEach((line, li) => {
        if (line.text.length === 0) {
          // Reveal empty lines instantly so they act as spacers.
          push(() => {
            if (cancelled) return;
            setRendered((prev) => {
              const next = [...prev];
              next[li] = "";
              return next;
            });
          }, delay);
          delay += 120;
          return;
        }
        for (let c = 1; c <= line.text.length; c++) {
          push(() => {
            if (cancelled) return;
            setRendered((prev) => {
              const next = [...prev];
              next[li] = line.text.slice(0, c);
              return next;
            });
          }, delay);
          delay += speed;
        }
        delay += 260;
      });
      push(() => {
        if (cancelled) return;
        setDone(true);
        if (loop) push(play, 2600);
      }, delay);
    };

    play();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lines, speed, startDelay, loop, reduce]);

  const lastActive = rendered.length - 1;

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const text = rendered[i];
        if (text === undefined) return null;
        const showCursor = !done && i === lastActive;
        return (
          <div key={i} className={line.className}>
            {text}
            {showCursor && (
              <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 animate-pulse bg-current align-middle" />
            )}
          </div>
        );
      })}
    </div>
  );
}
