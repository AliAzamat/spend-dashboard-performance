// Formatting helpers used by the leaf cells. Intl formatters are EXPENSIVE to
// construct, so we build them once at module load, not per-render. (This is a
// deliberate early win — the naive render is slow for structural reasons, not
// because we were sloppy about formatter allocation.)
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function formatCents(cents: number): string {
  return money.format(cents / 100); // the ONLY cents->dollars divide
}

export function formatDay(epochMs: number): string {
  return day.format(epochMs);
}
