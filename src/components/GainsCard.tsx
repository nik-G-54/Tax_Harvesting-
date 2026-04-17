import React from 'react';
import { fmt } from '../utils/format';

interface GainsCardProps {
  title: string;
  stcg: { profits: number; losses: number; net?: number };
  ltcg: { profits: number; losses: number; net?: number };
  isAfter: boolean;
  savingsAmt?: number;
}

const GainsCard: React.FC<GainsCardProps> = ({ title, stcg, ltcg, isAfter, savingsAmt = 0 }) => {
  const netST = stcg.profits - stcg.losses;
  const netLT = ltcg.profits - ltcg.losses;
  const realised = netST + netLT;

  return (
    <div className={`rounded-[14px] p-7 ${isAfter ? 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] border border-blue-500/30 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] dark:shadow-none' : 'bg-white dark:bg-[#181f2e] border-none shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:shadow-none dark:border-solid dark:border dark:border-[#2d3748] text-gray-800 dark:text-slate-200'}`}>
      <h2 className={`text-[18px] font-bold mb-6 ${isAfter ? 'text-white' : 'text-gray-900 dark:text-[#f1f5f9]'}`}>{title}</h2>
      
      <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_120px] gap-x-3 sm:gap-x-0 text-[13px] sm:text-[15px] font-medium mb-[14px] pb-[4px]">
        <span></span>
        <span className={`text-right ${isAfter ? 'text-white' : 'text-gray-500 dark:text-[#cbd5e0]'}`}>Short-term</span>
        <span className={`text-right ${isAfter ? 'text-white' : 'text-gray-500 dark:text-[#cbd5e0]'}`}>Long-term</span>
      </div>

      {[
        { label: "Profits", st: stcg.profits, lt: ltcg.profits },
        { label: "Losses", st: -stcg.losses, lt: -ltcg.losses },
        { label: "Net Capital Gains", st: netST, lt: netLT },
      ].map(({ label, st, lt }) => (
        <div key={label} className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_120px] gap-x-3 sm:gap-x-0 text-[13px] sm:text-[14px] py-[8px] sm:py-[10px]">
          <span className={`font-semibold tracking-wide flex-shrink-0 ${isAfter ? 'text-white' : 'text-gray-700 dark:text-[#f1f5f9]'}`}>{label}</span>
          <span className={`font-semibold text-right ${isAfter ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{fmt(st)}</span>
          <span className={`font-semibold text-right ${isAfter ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{fmt(lt)}</span>
        </div>
      ))}

      {isAfter ? (
        <>
          <div className="flex flex-wrap sm:flex-nowrap items-baseline sm:items-center gap-2 sm:gap-6 mt-6 sm:mt-8">
            <span className="text-[15px] sm:text-[17px] font-bold text-white">
              Effective Capital Gains:
            </span>
            <span className="text-[20px] sm:text-[24px] font-bold text-white tracking-wide">{fmt(realised)}</span>
          </div>
          {savingsAmt > 0 && (
            <div className="mt-4 sm:mt-8 text-[13px] sm:text-[15px] font-medium text-white flex items-center gap-2">
              <span className="text-[16px] sm:text-[18px]">🎉</span> You are going to save upto <span className="font-bold">{fmt(savingsAmt)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-wrap sm:flex-nowrap items-baseline sm:items-center gap-2 sm:gap-6 mt-6 sm:mt-8">
          <span className={`text-[15px] sm:text-[17px] font-bold ${isAfter ? '' : 'text-gray-900 dark:text-[#f1f5f9]'}`}>Realised Capital Gains:</span>
          <span className={`text-[20px] sm:text-[24px] font-bold tracking-wide ${isAfter ? '' : 'text-gray-900 dark:text-[#f1f5f9]'}`}>{fmt(realised)}</span>
        </div>
      )}
    </div>
  );
};

export default GainsCard;
