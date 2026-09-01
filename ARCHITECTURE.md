# Spend Dashboard — Architecture

## What this is
A single-screen spend-management dashboard. An operator at a finance team stares
at it all day: a header with spend totals, a filter/search bar, and a **table of
card transactions** — thousands of them, sometimes tens of thousands in a month.

The whole product bet is **speed**. A finance dashboard that stutters when you
scroll or lags a quarter-second after every keystroke feels broken, no matter how
correct the numbers are. Our job is to make it render a huge dataset and stay at
60fps.

## The three panes
- **SummaryHeader** — total spend, count, largest transaction. Cheap to compute.
- **FilterBar** — merchant search, category filter, amount/date sort. Every
  keystroke re-derives the visible set. This is where jank is born.
- **TransactionTable** — the list. THIS is the expensive part. Render 20,000
  rows naively and every scroll and every filter re-lays-out the whole DOM.

## The scale problem, named now
The browser can comfortably keep a few hundred DOM nodes fluid. A transaction
row is not one node — it's a dozen (merchant, amount, category chip, date, card,
status). Twenty thousand rows is a **quarter of a million DOM nodes**. Mounting
them blocks the main thread for seconds; scrolling them thrashes layout; a single
filter keystroke asks React to reconcile the entire tree.

## The discipline: measure, then fix
The one rule that separates a senior frontend engineer from a guesser:
**never optimize by intuition.** We will, in order:
1. Build a **typed data layer** — the seam between the REST contract and the UI.
2. Render the full dataset the **naive** way and **measure the jank** (React
   Profiler commit times, the Performance panel's dropped frames, Lighthouse).
3. **Virtualize** the list so only visible rows mount.
4. **Memoize** to stop needless re-renders.
5. Move **filter/sort/search** off the critical path (and into a Web Worker when
   it earns it).
6. Ship an accessible **design-system** component or two.
7. **Measure the win** — the same instruments, before vs. after.

Every fix in steps 3–6 is chosen because a measurement in step 2 pointed at it.
We do not add virtualization because it's fashionable; we add it because the
Profiler showed a 900ms commit. The numbers drive the work.
