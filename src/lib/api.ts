// The API CLIENT — the single seam between the REST contract and the React app.
// Every component fetches through here; none of them constructs a URL or knows
// the wire JSON shape. That's the same discipline as the typed-REST prereq,
// now on the client side: one place that owns the contract.
import type {
  Transaction,
  TransactionPage,
  TxnQuery,
} from "../types/transaction";

const BASE = import.meta.env.VITE_API_BASE ?? "/api";

// The raw wire shape, as the server actually sends it. We keep it PRIVATE to
// this module — no other file imports it — because it's an implementation
// detail of the contract, not a thing the UI should reason about.
interface WireTxn {
  id: string;
  merchant_name: string;      // snake_case on the wire
  amount_cents: number;
  category: string;           // a plain string on the wire
  status: string;
  card_last4: string;
  posted_at: string;          // ISO-8601 string on the wire
}

interface WirePage {
  data: WireTxn[];
  next_cursor: string | null;
  total_count: number;
}

// NARROW the wire shape into our view model. This is where an untrusted string
// becomes a typed `Category`, and an ISO string becomes a cheap epoch number.
// If the wire ever adds a field or renames one, THIS is the only place to fix.
function toTransaction(w: WireTxn): Transaction {
  return {
    id: w.id,
    merchant: w.merchant_name,
    amount: w.amount_cents,
    category: narrowCategory(w.category),
    status: narrowStatus(w.status),
    cardLast4: w.card_last4,
    postedAt: Date.parse(w.posted_at),
  };
}

function narrowCategory(s: string): Transaction["category"] {
  const known = ["travel", "software", "meals", "advertising", "office"];
  return (known.includes(s) ? s : "other") as Transaction["category"];
}

function narrowStatus(s: string): Transaction["status"] {
  return s === "pending" || s === "declined" ? s : "cleared";
}

export async function fetchTransactions(
  query: TxnQuery,
  cursor: string | null = null,
  limit = 500,
): Promise<TransactionPage> {
  const params = new URLSearchParams({
    search: query.search,
    category: query.category,
    sort_by: query.sortBy,
    sort_dir: query.sortDir,
    limit: String(limit),
  });
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${BASE}/transactions?${params}`);
  if (!res.ok) throw new Error(`transactions ${res.status}`);
  const page = (await res.json()) as WirePage;

  return {
    items: page.data.map(toTransaction),
    nextCursor: page.next_cursor,
    total: page.total_count,
  };
}
