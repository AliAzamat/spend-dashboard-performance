// The row now composes the design-system Chip instead of ad-hoc styled spans.
// Category and status both become Chips with the right tone — one consistent,
// accessible primitive, mapped from domain values to tones in one small map.
import { memo } from "react";
import type { Transaction, TxnStatus } from "../types/transaction";
import { formatCents, formatDay } from "../lib/format";
import { Chip } from "../ds/Chip";

interface RowProps {
  txn: Transaction;
  onFlag: (id: string) => void;
}

// Map a domain status to a design-system tone in ONE place.
const statusTone = {
  cleared: "success",
  pending: "warning",
  declined: "danger",
} as const satisfies Record<TxnStatus, string>;

function TransactionRowInner({ txn, onFlag }: RowProps) {
  return (
    <div className="txn-row" role="row">
      <span className="cell merchant" role="cell">{txn.merchant}</span>
      <span className="cell amount" role="cell">{formatCents(txn.amount)}</span>
      <span className="cell" role="cell">
        <Chip tone="info">{txn.category}</Chip>
      </span>
      <span className="cell" role="cell">
        <Chip tone={statusTone[txn.status]} srLabel={`Status: ${txn.status}`}>
          {txn.status}
        </Chip>
      </span>
      <span className="cell card" role="cell">•••• {txn.cardLast4}</span>
      <span className="cell date" role="cell">{formatDay(txn.postedAt)}</span>
      <button className="cell flag" onClick={() => onFlag(txn.id)}>
        Flag
      </button>
    </div>
  );
}

export const TransactionRow = memo(TransactionRowInner);
