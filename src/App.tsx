import React, { useEffect } from 'react';
import { HarvestProvider, useHarvest, useAfterGains } from './context/HarvestContext';
import { fetchHoldings, fetchCapitalGains } from './api/mockApi';
import GainsCard from './components/GainsCard';
import HoldingsTable from './components/HoldingsTable';
import Loader from './components/Loader';
import Disclaimer from './components/Disclaimer';

const MainApp: React.FC = () => {
  const { state, dispatch } = useHarvest();
  const afterGains = useAfterGains();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [holdings, cgData] = await Promise.all([
          fetchHoldings(),
          fetchCapitalGains()
        ]);
        dispatch({ type: "LOAD_SUCCESS", payload: { holdings, capitalGains: cgData.capitalGains } });
      } catch (err: any) {
        dispatch({ type: "LOAD_ERROR", payload: err.message || "Failed to load data" });
      }
    };
    loadData();
  }, [dispatch]);

  if (state.loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 py-6 pb-[60px]">
        <Loader />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 py-6 pb-[60px]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-[14px] flex justify-between items-center">
          <span className="font-medium text-[14px]">{state.error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-6 pb-[60px]">
      <div className="flex items-center gap-4 mb-5">
        <h1 className="text-[22px] font-bold text-[#f1f5f9]">Tax Optimisation</h1>
        <div className="relative group/tooltip">
          <button className="text-[#4f8ef7] text-[14px] font-medium underline bg-transparent border-none cursor-pointer">
            How it works?
          </button>
          <div className="hidden group-hover/tooltip:block absolute top-[28px] left-0 bg-[#1e2433] border border-[#2d3748] rounded-[10px] p-4 w-[300px] z-50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-[13px] leading-[1.7] text-[#cbd5e0]">
            <ul className="pl-4 mb-[10px] list-disc">
              <li>See your capital gains for FY 2024-25 in the left card</li>
              <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
              <li>Instantly see your updated tax liability in the right card</li>
            </ul>
            <div><strong className="text-[#f1f5f9]">Pro tip:</strong> Experiment with different combinations of your holdings to optimise your tax liability</div>
          </div>
        </div>
      </div>

      <Disclaimer />

      {state.capitalGains && afterGains && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
          <GainsCard 
            title="Pre Harvesting" 
            stcg={state.capitalGains.stcg} 
            ltcg={state.capitalGains.ltcg} 
            isAfter={false} 
          />
          <GainsCard 
            title="After Harvesting" 
            stcg={afterGains.stcg} 
            ltcg={afterGains.ltcg} 
            isAfter={true} 
            savingsAmt={afterGains.originalTotalGains - afterGains.totalGains} 
          />
        </div>
      )}

      <HoldingsTable />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HarvestProvider>
      <div className="min-h-screen bg-[#0f1117] text-[#e2e8f0] font-['DM_Sans',sans-serif]">
        <MainApp />
      </div>
    </HarvestProvider>
  );
};

export default App;
