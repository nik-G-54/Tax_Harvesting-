import React from 'react';
import { useHarvest } from '../context/HarvestContext';
import { Holding } from '../types';
import { fmt, fmtNum } from '../utils/format';

interface Props {
  holding: Holding;
}

const GainCell: React.FC<{ gain: number; balance: number; ticker: string }> = ({ gain, balance, ticker }) => {
  const isPos = gain > 0.001;
  const isNeg = gain < -0.001;
  return (
    <div>
      <div className={`font-semibold ${isPos ? 'text-[#22c55e]' : isNeg ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
        {fmt(gain)}
      </div>
      <div className="text-[11px] text-[#64748b] mt-0.5">{fmtNum(balance)} {ticker}</div>
    </div>
  );
};

const HoldingRow: React.FC<Props> = ({ holding }) => {
  const { state, dispatch } = useHarvest();
  
  const isSelected = state.selected.has(holding.id);
  
  const handleToggle = () => {
    dispatch({ type: "TOGGLE_ROW", payload: holding.id });
  };
  
  return (
    <tr 
      className={`border-t border-[#1e2433] transition-colors cursor-pointer ${isSelected ? 'bg-[#1a2d50] hover:bg-[#1e3260]' : 'hover:bg-[#1e2640]'}`}
      onClick={handleToggle}
    >
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          className="w-[17px] h-[17px] cursor-pointer accent-[#2563eb]"
          checked={isSelected}
          onChange={handleToggle}
        />
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle">
        <div className="flex items-center gap-3">
          <img
            src={holding.logo}
            alt={holding.coin}
            className="w-9 h-9 rounded-full object-contain bg-[#2d3748] shrink-0"
            onError={e => { (e.target as HTMLImageElement).src = "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg"; }}
          />
          <div>
            <div className="font-semibold text-[#f1f5f9] text-[14px]">
              {holding.coinName.length > 20 ? holding.coinName.slice(0, 20) + "…" : holding.coinName}
            </div>
            <div className="text-[11px] text-[#64748b] mt-px">{holding.coin}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle text-right">
        <div className="font-semibold text-[#e2e8f0]">{fmtNum(holding.totalHolding, 4)} {holding.coin}</div>
        <div className="text-[11px] text-[#64748b] mt-0.5">${fmtNum(holding.averageBuyPrice, 2)}/{holding.coin}</div>
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle text-right">
        <div className="font-semibold text-[#e2e8f0]">${fmtNum(holding.currentPrice, 2)}</div>
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle text-right">
        <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} ticker={holding.coin} />
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle text-right">
        <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} ticker={holding.coin} />
      </td>
      <td className="p-4 text-[13px] text-[#cbd5e0] align-middle text-right">
        {isSelected ? (
          <span className="text-[#94a3b8] font-medium">{fmtNum(holding.totalHolding, 4)} {holding.coin}</span>
        ) : (
          <span className="text-[#4a5568]">—</span>
        )}
      </td>
    </tr>
  );
};

export default HoldingRow;
