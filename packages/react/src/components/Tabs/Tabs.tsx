import React from 'react';

import { TabsContent } from './TabsContent.js';
import { TabsProvider } from './TabsContext.mjs';
import { TabsTrigger } from './TabsTrigger.js';

interface TabsProps extends React.PropsWithChildren {
  tbsDefaultId: string;
  tbsControllerId?: string;
  tbsOnBtnTabChangeClick?: (id: string) => void;
}

function TabsComponent({
  tbsDefaultId,
  tbsControllerId: controlledId,
  tbsOnBtnTabChangeClick,
  children,
}: TabsProps) {
  const [uncontrolledId, setUncontrolledId] = React.useState(
    tbsDefaultId || '',
  );

  const isControlled = controlledId !== undefined;
  const resolvedTbsId = isControlled ? controlledId : uncontrolledId;

  const handleIdChange = (newId: string) => {
    if (!isControlled) {
      setUncontrolledId(newId);
    }
    tbsOnBtnTabChangeClick?.(newId);
  };

  return (
    <TabsProvider
      value={{
        tbsId: resolvedTbsId,
        tbsOnBtnTabChangeClick: handleIdChange,
      }}
    >
      {children}
    </TabsProvider>
  );
}

const Tabs = Object.assign(TabsComponent, {
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs };
export type { TabsProps };
