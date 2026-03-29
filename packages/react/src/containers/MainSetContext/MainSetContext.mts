import React from 'react';

interface MainSetContextValue {
  isOverlayOpenById: Record<string, boolean>;
  overlayStackIds: string[];
  // setOverlayOpenById: (id: string, isOpen: boolean) => void;
  toggleOverlayOpenById: (id: string) => void;
}

const MainSetContext = React.createContext<MainSetContextValue | null>(null);

const useMainSet = (): MainSetContextValue => {
  const context = React.useContext(MainSetContext);

  if (!context) {
    throw new Error('useMainSet must be used within a MainSetProvider');
  }

  return context;
};

export { MainSetContext, useMainSet };
export type { MainSetContextValue };
