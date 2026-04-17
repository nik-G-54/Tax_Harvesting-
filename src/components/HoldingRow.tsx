import React, { useState } from 'react';
import { useHarvest } from '../context/HarvestContext';
import { Holding } from '../types';
import { fmt, fmtNum } from '../utils/format';
import { Menu } from 'lucide-react';

interface Props {
  holding: Holding;
}

const TooltipNum: React.FC<{ exact: string | number; children: React.ReactNode }> = ({ exact, children }) => (
  <div className="relative group/tt inline-block">
    <div className="cursor-help min-w-min">{children}</div>
    <div className="hidden group-hover/tt:block absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-[#0f172a] text-[12px] font-bold border border-gray-200 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] whitespace-nowrap pointer-events-none">
      {exact}
    </div>
  </div>
);

const GainCell: React.FC<{ gain: number; balance: number; ticker: string }> = ({ gain, balance, ticker }) => {
  const isPos = gain > 0;
  const isNeg = gain < 0;
  return (
    <div>
      <div className={`font-semibold ${isPos ? 'text-[#22c55e]' : isNeg ? 'text-[#ef4444]' : 'text-gray-500 dark:text-[#64748b]'}`}>
        <TooltipNum exact={gain < 0 ? `-$${Math.abs(gain)}` : `+$${gain}`}>
          {fmt(gain)}
        </TooltipNum>
      </div>
      <div className="text-[11px] text-gray-400 dark:text-[#64748b] mt-0.5">
        <TooltipNum exact={`${balance} ${ticker}`}>
          {fmtNum(balance)} {ticker}
        </TooltipNum>
      </div>
    </div>
  );
};

const HoldingRow: React.FC<Props> = ({ holding }) => {
  const { state, dispatch } = useHarvest();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isSelected = state.selected.has(holding.id);
  
  const handleToggle = () => {
    dispatch({ type: "TOGGLE_ROW", payload: holding.id });
  };
  
  return (
    <>
      <tr 
        className={`border-t border-gray-100 dark:border-[#1e2433] transition-colors cursor-pointer ${isSelected ? 'bg-blue-50 dark:bg-[#1a2d50] hover:bg-blue-100 dark:hover:bg-[#1e3260]' : 'hover:bg-gray-50 dark:hover:bg-[#1e2640]'}`}
        onClick={handleToggle}
      >
        <td className="p-4 md:p-4 pl-4 pr-1 md:px-4 text-[13px] text-[#cbd5e0] align-middle" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          className="w-[17px] h-[17px] cursor-pointer accent-[#2563eb]"
          checked={isSelected}
          onChange={handleToggle}
        />
      </td>
      <td className="p-3 md:p-4 text-[13px] text-[#cbd5e0] align-middle">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={holding.logo}
            alt={holding.coin}
            className="w-9 h-9 rounded-full object-contain bg-gray-50 dark:bg-[#2d3748] shrink-0"
            onError={e => { (e.target as HTMLImageElement).src = "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg"; }}
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-[#f1f5f9] text-[14px]">
              {holding.coinName.length > 20 ? holding.coinName.slice(0, 20) + "…" : holding.coinName}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-[#64748b] mt-px">{holding.coin}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle text-right md:text-center w-full">
        <div className="flex items-center justify-end md:block gap-3">
          <div className="text-right md:text-center">
            <div className="font-semibold text-gray-900 dark:text-[#e2e8f0] tracking-wide">
              <TooltipNum exact={`${holding.totalHolding} ${holding.coin}`}>
                {fmtNum(holding.totalHolding, 4)} {holding.coin}
              </TooltipNum>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-[#8e9baf] mt-0.5">
              <span className="md:hidden">
                <TooltipNum exact={`$${holding.totalHolding * holding.currentPrice}`}>
                  ${fmtNum(holding.totalHolding * holding.currentPrice, 2)}
                </TooltipNum>
              </span>
              <span className="hidden md:inline">
                <TooltipNum exact={`$${holding.currentPrice} / ${holding.coin}`}>
                  ${fmtNum(holding.currentPrice, 2)}/{holding.coin}
                </TooltipNum>
              </span>
            </div>
          </div>
          <button 
            className="md:hidden flex-shrink-0 p-2 rounded-lg bg-gray-100 dark:bg-[#1e2433] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d3748] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      </td>
      <td className="p-4 hidden md:table-cell text-[13px] text-[#cbd5e0] align-middle text-center">
        <div className="font-semibold text-gray-900 dark:text-[#e2e8f0] tracking-wide">
          <TooltipNum exact={`$${holding.totalHolding * holding.currentPrice}`}>
            ${fmtNum(holding.totalHolding * holding.currentPrice, 2)}
          </TooltipNum>
        </div>
      </td>
      <td className="p-4 hidden md:table-cell text-[13px] text-[#cbd5e0] align-middle text-center">
        <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} ticker={holding.coin} />
      </td>
      <td className="p-4 hidden md:table-cell text-[13px] text-[#cbd5e0] align-middle text-center">
        <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} ticker={holding.coin} />
      </td>
      <td className="p-4 hidden md:table-cell text-[13px] text-[#cbd5e0] align-middle text-center">
        {isSelected ? (
          <span className="text-gray-800 dark:text-[#94a3b8] font-medium">{fmtNum(holding.totalHolding, 4)} {holding.coin}</span>
        ) : (
          <span className="text-gray-400 dark:text-[#4a5568]">—</span>
        )}
      </td>
    </tr>
    {isExpanded && (
      <tr className="md:hidden bg-gray-50/50 dark:bg-[rgba(15,17,23,0.3)] shadow-inner">
        <td colSpan={3} className="px-5 py-4 border-t border-gray-100 dark:border-[#1e2433]">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <div className="text-[11px] font-medium text-gray-500 dark:text-[#8e9baf] mb-1">Short-term Gains</div>
                <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} ticker={holding.coin} />
             </div>
             <div>
                <div className="text-[11px] font-medium text-gray-500 dark:text-[#8e9baf] mb-1">Long-term Gains</div>
                <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} ticker={holding.coin} />
             </div>
             <div className="col-span-2 mt-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-[11px] font-medium text-gray-500 dark:text-[#8e9baf] mb-1">Amount to Sell</div>
                {isSelected ? (
                  <span className="text-gray-800 dark:text-[#94a3b8] text-[13px] font-medium">{fmtNum(holding.totalHolding, 4)} {holding.coin}</span>
                ) : (
                  <span className="text-gray-400 dark:text-[#4a5568] text-[13px]">—</span>
                )}
             </div>
          </div>
        </td>
      </tr>
    )}
    </>
  );
};

export default HoldingRow;
