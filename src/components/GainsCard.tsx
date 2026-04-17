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
    <div className={`rounded-[14px] p-7 ${isAfter ? 'bg-[#2563eb] text-white' : 'bg-[#181f2e] border border-[#2d3748] text-slate-200'}`}>
      <h2 className="text-[18px] font-bold mb-6 text-[#f1f5f9]">{title}</h2>
      
      <div className={`grid grid-cols-[1fr_120px_120px] text-[13px] font-semibold mb-[14px] pb-[10px] border-b ${isAfter ? 'text-white/60 border-white/20' : 'text-[#64748b] border-[#2d3748]'}`}>
        <span></span>
        <span className="text-right">Short-term</span>
        <span className="text-right">Long-term</span>
      </div>

      {[
        { label: "Profits", st: stcg.profits, lt: ltcg.profits },
        { label: "Losses", st: stcg.losses, lt: ltcg.losses },
        { label: "Net Capital Gains", st: netST, lt: netLT },
      ].map(({ label, st, lt }) => (
        <div key={label} className={`grid grid-cols-[1fr_120px_120px] text-[14px] py-[9px] border-b ${isAfter ? 'border-white/10' : 'border-[#1e2433]'}`}>
          <span className={`font-medium ${isAfter ? 'text-white/75' : 'text-[#94a3b8]'}`}>{label}</span>
          <span className="font-semibold text-right text-[#e2e8f0]">{fmt(st)}</span>
          <span className="font-semibold text-right text-[#e2e8f0]">{fmt(lt)}</span>
        </div>
      ))}

      <div className={`flex justify-between items-center mt-5 pt-4 border-t ${isAfter ? 'border-white/25' : 'border-[#2d3748]'}`}>
        <span className="text-[15px] font-bold text-[#f1f5f9]">
          {isAfter ? "Effective Capital Gains:" : "Realised Capital Gains:"}
        </span>
        <span className="text-[20px] font-extrabold text-[#f1f5f9]">{fmt(realised)}</span>
      </div>

      {isAfter && savingsAmt > 0 && (
        <div className="mt-3.5 bg-white/15 rounded-lg py-2.5 px-3.5 text-[13px] font-semibold text-white flex items-center gap-1.5">
          <span>🎉</span> Your taxable capital gains are reduced by: {fmt(savingsAmt)}
        </div>
      )}
    </div>
  );
};

export default GainsCard;
