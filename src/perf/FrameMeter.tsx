// A live dropped-frame meter. A smooth UI paints a frame every ~16.7ms (60fps).
// If the gap between two animation frames blows past that, the main thread was
// busy and the user saw a stutter. We count those and show them on screen so
// jank is VISIBLE, not just felt.
import { useEffect, useRef, useState } from "react";

const FRAME_BUDGET_MS = 1000 / 60; // 16.7ms

export function FrameMeter() {
  const [dropped, setDropped] = useState(0);
  const [worst, setWorst] = useState(0);
  const last = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const delta = now - last.current;
      last.current = now;
      // A delta well over one frame budget means at least one dropped frame.
      if (delta > FRAME_BUDGET_MS * 1.5) {
        const missed = Math.round(delta / FRAME_BUDGET_MS) - 1;
        setDropped((d) => d + missed);
        setWorst((w) => Math.max(w, delta));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="frame-meter" role="status" aria-live="polite">
      dropped frames: <b>{dropped}</b> · worst gap: <b>{worst.toFixed(0)}ms</b>
    </div>
  );
}
