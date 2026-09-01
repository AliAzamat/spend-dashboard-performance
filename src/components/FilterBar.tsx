// The filter bar. It drives a TxnQuery. The subtle performance rule lives in
// how its output is CONSUMED (see App.tsx / useDeferredValue), not here — this
// component just reports the user's intent as fast as they type.
import type { Category, TxnQuery } from "../types/transaction";

const CATEGORIES: (Category | "all")[] = [
  "all", "travel", "software", "meals", "advertising", "office", "other",
];

interface Props {
  query: TxnQuery;
  onChange: (next: TxnQuery) => void;
}

export function FilterBar({ query, onChange }: Props) {
  return (
    <div className="filter-bar" role="search">
      <input
        className="search"
        type="search"
        placeholder="Search merchant…"
        aria-label="Search transactions by merchant"
        value={query.search}
        onChange={(e) => onChange({ ...query, search: e.target.value })}
      />
      <select
        aria-label="Filter by category"
        value={query.category}
        onChange={(e) =>
          onChange({ ...query, category: e.target.value as TxnQuery["category"] })
        }
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button
        onClick={() =>
          onChange({ ...query, sortDir: query.sortDir === "asc" ? "desc" : "asc" })
        }
        aria-label={`Sort ${query.sortDir === "asc" ? "descending" : "ascending"}`}
      >
        Sort {query.sortDir === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
