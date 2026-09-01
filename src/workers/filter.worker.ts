// The SAME pure function, now running on a SEPARATE thread. The worker has no
// DOM and no React — it just receives the data + query, filters/sorts, and
// posts the result back. Because filterAndSort was pure, it drops straight in.
import { filterAndSort } from "../lib/filterTxns";
import type { Transaction, TxnQuery } from "../types/transaction";

// A tagged request so we can ignore stale responses (see the hook).
interface FilterRequest {
  reqId: number;
  all: Transaction[];
  query: TxnQuery;
}

self.onmessage = (e: MessageEvent<FilterRequest>) => {
  const { reqId, all, query } = e.data;
  const result = filterAndSort(all, query);
  // Post back the result tagged with the request id it answers.
  (self as unknown as Worker).postMessage({ reqId, result });
};
