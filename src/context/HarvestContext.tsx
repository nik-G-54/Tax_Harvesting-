import React, { createContext } from 'react';

export const HarvestContext = createContext(null);

export const HarvestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HarvestContext.Provider value={null}>
      {children}
    </HarvestContext.Provider>
  );
};
