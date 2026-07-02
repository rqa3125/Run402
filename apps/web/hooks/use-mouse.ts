"use client";

import * as React from "react";

/** Global pointer position in viewport coordinates (px). */
export function useMouse() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pos;
}
