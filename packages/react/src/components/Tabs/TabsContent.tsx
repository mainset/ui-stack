'use client';

import React from 'react';

import {
  getTabsContentId,
  getTabsTriggerId,
  useTabsContext,
} from './TabsContext.mjs';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  tbsId: string;
}

function TabsContent({ tbsId, children, ...props }: TabsContentProps) {
  const context = useTabsContext();

  if (context.tbsId !== tbsId) return null;

  return (
    <div
      role="tabpanel"
      id={getTabsContentId(context.tbsBaseId, tbsId)}
      aria-labelledby={getTabsTriggerId(context.tbsBaseId, tbsId)}
      tabIndex={0}
      data-state="active"
      {...props}
    >
      {children}
    </div>
  );
}

export { TabsContent };
export type { TabsContentProps };
