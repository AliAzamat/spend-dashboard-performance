// The header. Cheap by nature — three numbers — but note that it recomputes on
// EVERY render because the sum runs inline. We'll fix that with useMemo later;
// for now it's part of the honest, unoptimized baseline.
import type { Transaction } from "../types/transaction";
import { formatCents } from "../lib/format";

export function SummaryHeader({ txns }: { txns: Transaction[] }) {
  // Recomputed every render — deliberately, for the baseline.
  const total = txns.reduce((sum, t) => sum + t.amount, 0);
  const largest = txns.reduce((m, t) => Math.max(m, t.amount), 0);

  return (
    <header className="summary">
      <div className="stat">
        <span className="stat-label">Total spend</span>
        <span className="stat-value">{formatCents(total)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Transactions</span>
        <span className="stat-value">{txns.length.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Largest</span>
        <span className="stat-value">{formatCents(largest)}</span>
      </div>
    </header>
  );
}
