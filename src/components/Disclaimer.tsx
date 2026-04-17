import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const Disclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5 relative z-10">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-[#1a2035] hover:bg-[#1e2640] border border-[#2d3748] py-[14px] px-5 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'}`}
      >
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#94a3b8]">
          <Info size={18} className="text-[#3b82f6]" />
          <span>Important Notes And Disclaimers</span>
        </div>
        <div className="text-[#64748b]">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-5 bg-[#131824] border border-[#2d3748] border-t-0 rounded-b-[10px] text-[13px] text-[#94a3b8] leading-[1.8]">
          <ul className="space-y-1">
            <li>• Tax loss harvesting is a strategy to reduce taxable capital gains by selling assets at a loss.</li>
            <li>• The figures shown are estimates based on your portfolio data and may not reflect actual tax liability.</li>
            <li>• Consult a qualified tax advisor before making investment decisions.</li>
            <li>• Short-term gains apply to assets held for less than 3 years; long-term gains apply to assets held for 3+ years.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Disclaimer;
