// The domain models the whole UI speaks. These are the VIEW MODELS — the shape
// the React components want — which is deliberately not identical to the raw
// JSON the REST API returns. We narrow the wire shape into these at the client
// boundary (see api.ts) so the rest of the app never touches an `any`.

// Amounts are integer CENTS on the wire and stay cents in memory. We format to
// dollars only at the very edge (a cell), never in business logic — floating
// point on money is a bug waiting to happen.
export type Cents = number;

// A closed set of categories. A discriminated string-literal union means a typo
// like "Trvel" is a compile error, and a `switch` over it can be exhaustive.
export type Category =
  | "travel"
  | "software"
  | "meals"
  | "advertising"
  | "office"
  | "other";

export type TxnStatus = "cleared" | "pending" | "declined";

export interface Transaction {
  id: string;
  merchant: string;
  amount: Cents;          // always cents; never a float dollar value
  category: Category;
  status: TxnStatus;
  cardLast4: string;      // "4821"
  postedAt: number;       // epoch ms — a number sorts and compares cheaply
}

// The paginated envelope the list endpoint returns. Keyset cursor, not offset,
// so deep pages stay cheap (the same pattern the REST prereq taught).
export interface TransactionPage {
  items: Transaction[];
  nextCursor: string | null;
  total: number;          // total matching the current filter, for the header
}

// The filter/sort state the UI drives the query with. Kept flat and serializable
// so we can later hand it to a Web Worker or put it in the URL untouched.
export interface TxnQuery {
  search: string;
  category: Category | "all";
  sortBy: "postedAt" | "amount" | "merchant";
  sortDir: "asc" | "desc";
}
