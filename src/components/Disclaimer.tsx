import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const Disclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-5 relative z-10">
      <div 
        className={`bg-[#eff6ff] dark:bg-[#1a2035] border border-[#60a5fa] dark:border-[#2d3748] transition-colors ${isOpen ? 'rounded-[10px]' : 'rounded-[10px]'}`}
      >
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`py-[14px] px-5 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-[#1e2640] ${isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'}`}
        >
          <div className="flex items-center gap-3 text-[14px] font-medium text-[#0f1117] dark:text-[#94a3b8]">
            <Info size={18} className="text-[#2563eb] dark:text-[#3b82f6]" />
            <span>Important Notes And Disclaimers</span>
          </div>
          <div className="text-[#64748b]">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        
        {isOpen && (
          <div className="p-5 pt-1 text-[13px] text-[#1e293b] dark:text-[#cbd5e0] leading-[1.8]">
            <ul className="list-disc pl-4 space-y-1.5 marker:text-gray-400 dark:marker:text-gray-500">
              <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
              <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
              <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
              <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
              <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Disclaimer;
