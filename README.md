# Ramp | Performance-First Spend Management Dashboard

A React + TypeScript spend-management dashboard shaped exactly like the one a Ramp Frontend engineer ships — a fast, beautiful surface that renders tens of thousands of card transactions without ever dropping a frame. You start by building a typed data layer (a transactions API client and typed domain models on top of the ts-typed-rest-api contract), then render the whole dataset the naive way and MEASURE the jank yourself with the React Profiler, dropped-frame counters, and Lighthouse — you feel the problem before you fix it. From there you fix it properly: list virtualization (only the visible rows mount), memoization and stable callbacks (kill the re-render storms), and filtering/sorting/search over the full dataset that never blocks the main thread — including when to move the work into a Web Worker. You build one or two accessible in-house design-system components along the way, and you close by measuring the win: before/after frame times and a Lighthouse score that proves the dashboard is fast. The throughline is a senior frontend discipline — never guess about performance, measure it, and let the numbers drive every decision.

Built step-by-step with [KhwajaLabs Build](https://khwajalabs.com).

## Stack
- React
- TypeScript
- Vite
- virtualization
- web performance
