// A hook that runs filtering in the worker and hands the result back to React.
// It coalesces requests: only the LATEST query matters, so responses to stale
// queries are dropped. This keeps the main thread free of the sort entirely.
import { useEffect, useMemo, useRef, useState } from "react";
import type { Transaction, TxnQuery } from "../types/transaction";

export function useFilteredTxns(
  all: Transaction[],
  query: TxnQuery,
): Transaction[] {
  const [visible, setVisible] = useState<Transaction[]>(all);
  const workerRef = useRef<Worker | null>(null);
  const latestReq = useRef(0);

  // One worker for the component's life, torn down on unmount.
  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/filter.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (e: MessageEvent<{ reqId: number; result: Transaction[] }>) => {
      // Drop stale responses: if a newer request went out, ignore this one.
      if (e.data.reqId === latestReq.current) setVisible(e.data.result);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  // Post a new filter request whenever the inputs change. The reqId lets the
  // handler above discard any response that isn't for the newest request.
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) return;
    const reqId = ++latestReq.current;
    worker.postMessage({ reqId, all, query });
  }, [all, query]);

  return visible;
}
