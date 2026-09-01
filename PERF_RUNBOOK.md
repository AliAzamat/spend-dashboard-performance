# Measuring this dashboard

## 1. React Profiler (commit cost)
The app is wrapped in <PerfProfiler>. Open the console and:
- **Reload** — read the `mount` commit. On the naive table with 20k rows this
  reads several hundred ms to ~1s. That's the DOM being built.
- **Type one character** in the search box — read the `update` commit. Naive,
  it re-renders the whole list: another few hundred ms. THAT is the keystroke lag.

## 2. Dropped frames (perceived jank)
The <FrameMeter> shows dropped frames live. Scroll the naive table fast and
watch the counter climb — every increment is a stutter the user felt. A smooth
build holds this near zero while scrolling.

## 3. Performance panel (ground truth)
DevTools → Performance → record → scroll and filter → stop.
- Look for **Long Tasks** (the red-cornered blocks > 50ms) — each one is a frame
  the main thread couldn't yield.
- Look at **Scripting** vs **Rendering** time. Naive: huge Rendering (layout of
  all rows). After virtualization: tiny, because only ~40 rows exist.

## 4. Lighthouse (the shareable score)
DevTools → Lighthouse → Performance → analyze.
- **Total Blocking Time (TBT)** is the metric that moves most here — it's the
  sum of the main-thread blocking we're about to eliminate.
- Record the **baseline score now**, before any fix. We compare against it in
  the final step. A number you didn't write down is a number you can't beat.
