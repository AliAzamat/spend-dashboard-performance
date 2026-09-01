// A thin wrapper around React's <Profiler>. It logs every COMMIT's duration —
// how long React spent applying that render to the DOM. This is the number
// that will read ~900ms on the naive table and ~8ms after we virtualize.
import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,        // "mount" | "update" | "nested-update"
  actualDuration, // time to render this commit (ms) — THE number we watch
  baseDuration,   // estimated time without memoization
) => {
  // In a real app you'd ship these to an analytics sink. Here we log so you can
  // read the commit cost live in the console as you scroll and filter.
  // eslint-disable-next-line no-console
  console.log(
    `[profiler] ${id} ${phase} commit=${actualDuration.toFixed(1)}ms ` +
      `(unmemoized≈${baseDuration.toFixed(1)}ms)`,
  );
};

export function PerfProfiler({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}
