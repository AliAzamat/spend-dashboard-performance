// The fix that matters most. Instead of mounting every row, we mount only the
// rows that fit in the viewport (plus a few above/below for smooth scrolling).
// 20,000 transactions, but at any instant only ~40 rows exist in the DOM.
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Transaction } from "../types/transaction";
import { TransactionRow } from "./TransactionRow";

const ROW_HEIGHT = 44; // px — a FIXED height makes windowing math O(1)

export function VirtualTransactionTable({ txns }: { txns: Transaction[] }) {
  // The scroll container. Virtualization needs a fixed-height, scrollable box
  // it can measure against; the "full" list height is faked with a spacer.
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: txns.length,          // how many rows EXIST (not how many render)
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,                 // render 8 extra rows past each edge (see below)
  });

  const virtualRows = virtualizer.getVirtualItems();

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

      {/* The scroll viewport. Fixed height; the browser scrolls THIS box. */}
      <div ref={parentRef} className="txn-scroll" style={{ overflow: "auto" }}>
        {/* A single tall spacer gives the scrollbar the FULL list's height,
            so the scrollbar thumb is the right size even though the DOM only
            holds ~40 real rows. */}
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualRows.map((vr) => {
            const txn = txns[vr.index];
            return (
              // Each visible row is absolutely positioned at its true offset,
              // so it lands exactly where it would in the full list.
              <div
                key={txn.id}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${vr.start}px)`,
                  height: ROW_HEIGHT,
                  width: "100%",
                }}
              >
                <TransactionRow txn={txn} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
