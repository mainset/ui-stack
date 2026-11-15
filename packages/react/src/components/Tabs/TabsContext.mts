'use client';

import React from 'react';

interface TabsContextValue {
  tbsId: string;
  tbsOnBtnTabChangeClick: (id: string) => void;
  /** Unique per <Tabs> instance, used to link triggers and panels via ARIA */
  tbsBaseId: string;
}

const getTabsTriggerId = (baseId: string, tbsId: string) =>
  `${baseId}-trigger-${tbsId}`;
const getTabsContentId = (baseId: string, tbsId: string) =>
  `${baseId}-content-${tbsId}`;

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

export { getTabsContentId, getTabsTriggerId, TabsProvider, useTabsContext };
export type { TabsContextValue };
