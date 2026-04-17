import React, { useEffect } from 'react';
import { HarvestProvider, useHarvest, useAfterGains } from './context/HarvestContext';
import { fetchHoldings, fetchCapitalGains } from './api/mockApi';
import GainsCard from './components/GainsCard';
import HoldingsTable from './components/HoldingsTable';
import Loader from './components/Loader';
import Disclaimer from './components/Disclaimer';
import { Sun, Moon } from 'lucide-react';

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
    <>
      <nav className="bg-white dark:bg-[#111827] w-full px-5 md:px-6 py-4 flex items-center justify-between shadow-sm dark:shadow-md border-b border-gray-200 dark:border-[#1f2937] transition-colors">
        <div className="flex items-center cursor-pointer select-none">
          <span className="text-[32px] font-bold tracking-tight text-[#2563eb]">Koin</span>
          <span className="text-[32px] font-bold tracking-tight text-[#f59e0b]">X</span>
        </div>
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e2433] text-gray-700 dark:text-gray-300 transition-colors block md:hidden"
            title="Toggle theme"
          >
            <Sun size={20} className="hidden dark:block" />
            <Moon size={20} className="block dark:hidden" />
          </button>
        </div>
      </nav>
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 pb-[60px]">
        <div className="flex items-center justify-between md:justify-start gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-[20px] md:text-[22px] font-bold text-[#0f1117] dark:text-[#f1f5f9]">Tax Harvesting</h1>
            <div className="relative group/tooltip flex justify-center">
              <button className="text-[#2563eb] dark:text-[#4f8ef7] text-[13px] md:text-[14px] font-medium underline bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity">
                How it works?
              </button>
              
              {/* Mobile Tooltip Wrapper */}
              <div className="md:hidden">
                <div className="hidden group-hover/tooltip:block absolute top-full mt-[10px] left-1/2 -translate-x-1/2 bg-[#0f1117] dark:bg-white rounded-[10px] p-3.5 w-[280px] z-50 shadow-xl text-[12px] leading-[1.6] text-[#e2e8f0] dark:text-[#1e293b] font-normal">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f1117] dark:bg-white rotate-45 border-l border-t border-[#0f1117] dark:border-white"></div>
                  <div className="relative z-10 pointer-events-auto">
                    <ul className="pl-4 mb-[10px] list-disc marker:text-gray-400">
                      <li>See your capital gains for FY 2024-25 in the left card</li>
                      <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
                      <li>Instantly see your updated tax liability in the right card</li>
                    </ul>
                    <div><strong className="text-white dark:text-black">Pro tip:</strong> Experiment with different combinations of your holdings to optimise your tax liability</div>
                  </div>
                </div>
              </div>

              {/* Desktop Tooltip Wrapper */}
              <div className="hidden md:block">
                <div className="hidden group-hover/tooltip:block absolute top-[30px] left-0 bg-[#0f1117] border border-[#2d3748] rounded-[10px] p-4 w-[340px] z-50 shadow-2xl text-[13px] leading-[1.7] text-[#e2e8f0]">
                  <ul className="pl-4 mb-[10px] list-disc marker:text-gray-500">
                    <li>See your capital gains for FY 2024-25 in the left card</li>
                    <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
                    <li>Instantly see your updated tax liability in the right card</li>
                  </ul>
                  <div><strong className="text-white">Pro tip:</strong> Experiment with different combinations of your holdings to optimise your tax liability</div>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e2433] text-gray-700 dark:text-gray-300 transition-colors hidden md:block"
            title="Toggle theme"
          >
            <Sun size={20} className="hidden dark:block" />
            <Moon size={20} className="block dark:hidden" />
          </button>
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
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Start natively in Dark Mode as requested layout default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <HarvestProvider>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1117] text-[#0f1117] dark:text-[#e2e8f0] font-sans transition-colors">
        <MainApp />
      </div>
    </HarvestProvider>
  );
};

export default App;
