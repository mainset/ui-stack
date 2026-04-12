import React from 'react';

interface TabsContextValue {
  tbsId: string;
  tbsOnBtnTabChangeClick: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a <Tabs> provider');
  }
  return context;
};

const TabsProvider = TabsContext.Provider;

export { TabsProvider, useTabsContext };
export type { TabsContextValue };
