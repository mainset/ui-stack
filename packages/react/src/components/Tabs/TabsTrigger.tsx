'use client';

import React from 'react';

import {
  getTabsContentId,
  getTabsTriggerId,
  useTabsContext,
} from './TabsContext.mjs';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tbsId: string;
}

function TabsTrigger({ tbsId, children, onClick, ...props }: TabsTriggerProps) {
  const context = useTabsContext();
  const isActive = context.tbsId === tbsId;

  // TODO: use ButtonBase with transparent theme
  // TODO: wrap triggers in a {Tabs.List role="tablist"} with roving tabindex + arrow-key navigation
  return (
    <button
      type="button"
      role="tab"
      id={getTabsTriggerId(context.tbsBaseId, tbsId)}
      aria-controls={getTabsContentId(context.tbsBaseId, tbsId)}
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
      // NOTE: composed after {...props}, so a consumer `onClick` can't silently replace tab switching
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) context.tbsOnBtnTabChangeClick(tbsId);
      }}
    >
      {children}
    </button>
  );
}

export { TabsTrigger };
export type { TabsTriggerProps };
