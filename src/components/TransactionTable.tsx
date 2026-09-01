// THE NAIVE TABLE. It maps over EVERY transaction and mounts a row for each.
// At 20,000 transactions this mounts ~250,000 DOM nodes. This is the version
// we will measure and then dismantle. It is intentionally slow.
import type { Transaction } from "../types/transaction";
import { TransactionRow } from "./TransactionRow";

export function TransactionTable({ txns }: { txns: Transaction[] }) {
  return (
    <div className="txn-table" role="table" aria-label="Transactions">
      <div className="txn-head" role="row">
        <span role="columnheader">Merchant</span>
        <span role="columnheader">Amount</span>
        <span role="columnheader">Category</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Card</span>
        <span role="columnheader">Date</span>
      </div>
      {/* The whole dataset, mounted at once. This single line is the jank. */}
      {txns.map((t) => (
        <TransactionRow key={t.id} txn={t} />
      ))}
    </div>
  );
}
