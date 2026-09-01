# Keeping it fast (regression guardrails)

A win you don't guard erodes. Lock these in so the next feature can't quietly
reintroduce the jank we just removed.

## Budgets (fail CI if exceeded)
- Table mount commit (20k rows): **< 30 ms** (headroom over our 9 ms).
- Search-keystroke commit: **< 16 ms** (one frame budget).
- Lighthouse Performance (CI, throttled): **≥ 90**.
- Total Blocking Time: **< 200 ms**.

## How to guard
- A CI Lighthouse run (lighthouse-ci) on a fixed 20k-row fixture, failing the
  build if the score drops below 90 or TBT exceeds budget.
- A React Profiler assertion in a test: render the table, assert the commit
  `actualDuration` stays under budget on a seeded dataset.
- Review rule: any new prop passed to a memoized row must have a stable identity
  (no inline objects/arrays/functions) — the reviewer checks, or a lint rule does.

## The habit
Every perf change ships with a before/after number in the PR description. "Feels
faster" is not a merge criterion. The number is.
