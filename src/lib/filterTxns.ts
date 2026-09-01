// The pure filter+sort function. It takes the full dataset and a query and
// returns the derived list. It's pure and synchronous — which means it's easy
// to test, easy to memoize, and (crucially) easy to move to a Web Worker later
// with zero change to its logic.
import type { Transaction, TxnQuery } from "../types/transaction";

export function filterAndSort(
  all: Transaction[],
  query: TxnQuery,
): Transaction[] {
  const needle = query.search.trim().toLowerCase();

  // Filter first (shrinks the set the sort has to touch), then sort.
  let out = all;
  if (needle || query.category !== "all") {
    out = all.filter((t) => {
      if (query.category !== "all" && t.category !== query.category) return false;
      if (needle && !t.merchant.toLowerCase().includes(needle)) return false;
      return true;
    });
  }

  // Sort a COPY — never mutate the source array, or memoization upstream breaks.
  const dir = query.sortDir === "asc" ? 1 : -1;
  const sorted = [...out].sort((a, b) => {
    switch (query.sortBy) {
      case "amount":
        return (a.amount - b.amount) * dir;
      case "merchant":
        return a.merchant.localeCompare(b.merchant) * dir;
      case "postedAt":
      default:
        return (a.postedAt - b.postedAt) * dir; // cheap numeric compare
    }
  });
  return sorted;
}
