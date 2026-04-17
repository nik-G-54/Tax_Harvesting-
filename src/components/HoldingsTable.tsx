import React, { useMemo } from 'react';
import { useHarvest } from '../context/HarvestContext';
import HoldingRow from './HoldingRow';

const HoldingsTable: React.FC = () => {
  const { state, dispatch } = useHarvest();
  
  const sortedHoldings = useMemo(() => {
    const arr = [...state.holdings];
    arr.sort((a, b) => {
      let av, bv;
      if (state.sortField === "stcg_gain") { av = a.stcg.gain; bv = b.stcg.gain; }
      else if (state.sortField === "ltcg_gain") { av = a.ltcg.gain; bv = b.ltcg.gain; }
      else if (state.sortField === "currentPrice") { av = a.currentPrice; bv = b.currentPrice; }
      else if (state.sortField === "totalHolding") { av = a.totalHolding * a.currentPrice; bv = b.totalHolding * b.currentPrice; }
      else { av = a.stcg.gain; bv = b.stcg.gain; }
      return state.sortDir === "desc" ? bv - av : av - bv;
    });
    return arr;
  }, [state.holdings, state.sortField, state.sortDir]);

  const handleSort = (field: any) => {
    dispatch({ type: "SET_SORT", payload: field });
  };

  const sortIcon = (field: string) => {
    if (state.sortField !== field) return <span className="ml-1 opacity-60">⇅</span>;
    return <span className="ml-1">{state.sortDir === "desc" ? "↓" : "↑"}</span>;
  };

  const allSelected = state.holdings.length > 0 && state.selected.size === state.holdings.length;
  // someSelected indicates that *some but not all* checkboxes are ticked
  const someSelected = state.selected.size > 0 && state.selected.size < state.holdings.length;

  const displayHoldings = state.showAll ? sortedHoldings : sortedHoldings.slice(0, 4);

  return (
    <div>
      <h2 className="text-[18px] font-bold text-[#f1f5f9] mb-4">Holdings</h2>
      <div className="bg-[#181f2e] border border-[#2d3748] rounded-[14px] overflow-hidden w-full overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="bg-[#1a2235]">
            <tr>
              <th className="p-4 text-left font-semibold text-[12px] text-[#64748b] uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  className="w-[17px] h-[17px] cursor-pointer accent-[#2563eb]"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected; }}
                  onChange={() => dispatch({ type: "TOGGLE_ALL" })}
                />
              </th>
              <th className="p-4 text-left font-semibold text-[12px] text-[#64748b] uppercase tracking-wider">Asset</th>
              <th className="p-4 text-right font-semibold text-[12px] text-[#64748b] uppercase tracking-wider cursor-pointer select-none hover:text-[#94a3b8] transition-colors" onClick={() => handleSort("totalHolding")}>
                Holdings<br /><span className="text-[10px] normal-case text-[#475569]">Avg Buy Price</span>
                {sortIcon("totalHolding")}
              </th>
              <th className="p-4 text-right font-semibold text-[12px] text-[#64748b] uppercase tracking-wider cursor-pointer select-none hover:text-[#94a3b8] transition-colors" onClick={() => handleSort("currentPrice")}>
                Current Price {sortIcon("currentPrice")}
              </th>
              <th className="p-4 text-right font-semibold text-[12px] text-[#64748b] uppercase tracking-wider cursor-pointer select-none hover:text-[#94a3b8] transition-colors" onClick={() => handleSort("stcg_gain")}>
                Short-Term {sortIcon("stcg_gain")}
              </th>
              <th className="p-4 text-right font-semibold text-[12px] text-[#64748b] uppercase tracking-wider cursor-pointer select-none hover:text-[#94a3b8] transition-colors" onClick={() => handleSort("ltcg_gain")}>
                Long-Term {sortIcon("ltcg_gain")}
              </th>
              <th className="p-4 text-right font-semibold text-[12px] text-[#64748b] uppercase tracking-wider">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayHoldings.map((h, i) => (
              <HoldingRow key={h.coin + i} holding={h} />
            ))}
          </tbody>
        </table>
        
        {state.holdings.length > 4 && (
          <div 
            className="text-center py-4 text-[#4f8ef7] text-[14px] font-semibold cursor-pointer hover:bg-[#1e2640] transition-colors border-t border-[#1e2433]"
            onClick={() => dispatch({ type: "TOGGLE_SHOW_ALL" })}
          >
            {state.showAll ? "View Less" : "View All"}
          </div>
        )}
      </div>
    </div>
  );
};

export default HoldingsTable;
