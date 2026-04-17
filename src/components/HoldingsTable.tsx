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
    if (state.sortField !== field) return null;
    return <span className="ml-1 text-[#4f8ef7]">{state.sortDir === "desc" ? "↓" : "↑"}</span>;
  };

  const allSelected = state.holdings.length > 0 && state.selected.size === state.holdings.length;
  // someSelected indicates that *some but not all* checkboxes are ticked
  const someSelected = state.selected.size > 0 && state.selected.size < state.holdings.length;

  const displayHoldings = state.showAll ? sortedHoldings : sortedHoldings.slice(0, 4);

  return (
    <div>
      <h2 className="text-[18px] font-bold text-gray-900 dark:text-[#f1f5f9] mb-4">Holdings</h2>
      <div className="bg-white dark:bg-[#181f2e] border border-gray-200 dark:border-[#2d3748] shadow-sm dark:shadow-none rounded-[14px] overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-full md:min-w-[800px]">
            <thead className="bg-[#f8fafc] dark:bg-[#0b0f17] border-b border-gray-200 dark:border-[#1e2433]">
            <tr>
              <th className="py-5 px-4 md:px-6 text-left font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide w-10 md:w-12 border-none">
                <input
                  type="checkbox"
                  className="w-[17px] h-[17px] cursor-pointer accent-[#2563eb]"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected; }}
                  onChange={() => dispatch({ type: "TOGGLE_ALL" })}
                />
              </th>
              <th className="py-5 px-4 md:px-6 text-left font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide border-none">Asset</th>
              <th className="py-5 px-4 md:px-6 text-right md:text-center font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide cursor-pointer border-none" onClick={() => handleSort("totalHolding")}>
                Holdings<br /><span className="hidden md:inline-block text-[11px] text-gray-500 dark:text-[#94a3b8] font-normal leading-tight mt-1">Current Market Rate</span>
              </th>
              <th className="py-5 px-6 hidden md:table-cell text-center font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide cursor-pointer border-none" onClick={() => handleSort("currentPrice")}>
                Total Current Value {sortIcon("currentPrice")}
              </th>
              <th className="py-5 px-6 hidden md:table-cell text-center font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide cursor-pointer border-none" onClick={() => handleSort("stcg_gain")}>
                Short-term {sortIcon("stcg_gain")}
              </th>
              <th className="py-5 px-6 hidden md:table-cell text-center font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide cursor-pointer border-none" onClick={() => handleSort("ltcg_gain")}>
                Long-Term {sortIcon("ltcg_gain")}
              </th>
              <th className="py-5 px-6 hidden md:table-cell text-center font-semibold text-[14px] text-gray-900 dark:text-[#f1f5f9] tracking-wide border-none">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayHoldings.map((h) => (
              <HoldingRow key={h.id} holding={h} />
            ))}
          </tbody>
        </table>
        </div>
        
        {state.holdings.length > 4 && (
          <div 
            className="text-center py-4 text-[#4f8ef7] text-[14px] font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2640] transition-colors border-t border-gray-200 dark:border-[#1e2433]"
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
