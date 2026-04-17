export interface GainDetails {
  balance: number;
  gain: number;
}

export interface Holding {
  id: number;
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainDetails;
  ltcg: GainDetails;
}

export interface CapitalGains {
  stcg: {
    profits: number;
    losses: number;
  };
  ltcg: {
    profits: number;
    losses: number;
  };
}

export type SortField = "stcg_gain" | "ltcg_gain" | "currentPrice" | "totalHolding";
export type SortDir = "asc" | "desc";

export interface HarvestState {
  holdings: Holding[];
  capitalGains: CapitalGains | null;
  selected: Set<number>;
  loading: boolean;
  error: string | null;
  sortField: SortField;
  sortDir: SortDir;
  showAll: boolean;
}

export type HarvestAction = 
  | { type: "LOAD_SUCCESS"; payload: { holdings: Holding[]; capitalGains: CapitalGains } }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "TOGGLE_ROW"; payload: number }
  | { type: "TOGGLE_ALL" }
  | { type: "SET_SORT"; payload: SortField }
  | { type: "TOGGLE_SHOW_ALL" };
