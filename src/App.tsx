// The list now derives from the worker-backed hook. The main thread posts a
// message and moves on; the actual filter/sort happens on another core. Even a
// pathological dataset can't freeze the input, because the input's thread never
// does the heavy work at all.
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchTransactions } from "./lib/api";
import { useFilteredTxns } from "./hooks/useFilteredTxns";
import type { Transaction, TxnQuery } from "./types/transaction";
import { SummaryHeader } from "./components/SummaryHeader";
import { FilterBar } from "./components/FilterBar";
import { VirtualTransactionTable } from "./components/VirtualTransactionTable";
import { PerfProfiler } from "./perf/PerfProfiler";
import { FrameMeter } from "./perf/FrameMeter";

const INITIAL_QUERY: TxnQuery = {
  search: "",
  category: "all",
  sortBy: "postedAt",
  sortDir: "desc",
};

export default function App() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [query, setQuery] = useState<TxnQuery>(INITIAL_QUERY);

  useEffect(() => {
    fetchTransactions(INITIAL_QUERY, null, 20000).then((page) =>
      setTxns(page.items),
    );
  }, []);

  // Heavy filter/sort runs on a worker thread; this returns the latest result.
  const visible = useFilteredTxns(txns, query);

  const summary = useMemo(() => {
    const total = visible.reduce((s, t) => s + t.amount, 0);
    const largest = visible.reduce((m, t) => Math.max(m, t.amount), 0);
    return { total, largest, count: visible.length };
  }, [visible]);

  const onFlag = useCallback((id: string) => {
    // eslint-disable-next-line no-console
    console.log("flag", id);
  }, []);

  return (
    <div className="app">
      <FrameMeter />
      <SummaryHeader summary={summary} />
      <FilterBar query={query} onChange={setQuery} />
      <PerfProfiler id="table">
        <VirtualTransactionTable txns={visible} onFlag={onFlag} />
      </PerfProfiler>
    </div>
  );
}
