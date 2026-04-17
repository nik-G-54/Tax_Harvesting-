import React, { createContext, useContext, useReducer } from 'react';
import { HarvestState, HarvestAction } from '../types';

interface HarvestContextType {
  state: HarvestState;
  dispatch: React.Dispatch<HarvestAction>;
}

const initialState: HarvestState = {
  holdings: [],
  capitalGains: null,
  selected: new Set<number>(),
  loading: true,
  error: null,
  sortField: "stcg_gain", // arbitrary default, could be anything
  sortDir: "desc",
  showAll: false,
};

function harvestReducer(state: HarvestState, action: HarvestAction): HarvestState {
  switch (action.type) {
    case "LOAD_SUCCESS":
      return {
        ...state,
        holdings: action.payload.holdings,
        capitalGains: action.payload.capitalGains,
        loading: false,
        error: null,
      };
    case "LOAD_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "TOGGLE_ROW": {
      const newSelected = new Set(state.selected);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selected: newSelected };
    }
    case "TOGGLE_ALL": {
      if (state.selected.size === state.holdings.length && state.holdings.length > 0) {
        return { ...state, selected: new Set() };
      }
      return { ...state, selected: new Set(state.holdings.map(h => h.id)) };
    }
    case "SET_SORT": {
      const sortField = action.payload;
      const sortDir = state.sortField === sortField && state.sortDir === "desc" ? "asc" : "desc";
      return { ...state, sortField, sortDir };
    }
    case "TOGGLE_SHOW_ALL":
      return { ...state, showAll: !state.showAll };
    default:
      return state;
  }
}

export const HarvestContext = createContext<HarvestContextType | null>(null);

export const HarvestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(harvestReducer, initialState);

  return (
    <HarvestContext.Provider value={{ state, dispatch }}>
      {children}
    </HarvestContext.Provider>
  );
};

export const useHarvest = (): HarvestContextType => {
  const context = useContext(HarvestContext);
  if (!context) {
    throw new Error("useHarvest must be used within a HarvestProvider");
  }
  return context;
};

export const useAfterGains = () => {
  const { state } = useHarvest();

  if (!state.capitalGains) return null;

  let stcgProfits = state.capitalGains.stcg.profits;
  let stcgLosses = state.capitalGains.stcg.losses;
  let ltcgProfits = state.capitalGains.ltcg.profits;
  let ltcgLosses = state.capitalGains.ltcg.losses;

  state.selected.forEach(id => {
    const holding = state.holdings.find(h => h.id === id);
    if (holding) {
      if (holding.stcg.gain > 0) {
        stcgProfits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        stcgLosses += Math.abs(holding.stcg.gain);
      }
      
      if (holding.ltcg.gain > 0) {
        ltcgProfits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        ltcgLosses += Math.abs(holding.ltcg.gain);
      }
    }
  });

  const stcgNet = stcgProfits - stcgLosses;
  const ltcgNet = ltcgProfits - ltcgLosses;

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses, net: stcgNet },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses, net: ltcgNet },
    totalGains: stcgNet + ltcgNet,
    originalTotalGains: (state.capitalGains.stcg.profits - state.capitalGains.stcg.losses) 
                        + (state.capitalGains.ltcg.profits - state.capitalGains.ltcg.losses)
  };
};
