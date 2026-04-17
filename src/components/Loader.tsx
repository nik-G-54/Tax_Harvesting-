import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-10 h-10 border-[3px] border-[#2d3748] border-t-[#2563eb] rounded-full animate-spin" />
      <div className="text-[#64748b] text-[14px]">Loading your portfolio data...</div>
    </div>
  );
};

export default Loader;
