import React from 'react';

import { useTabsContext } from './TabsContext.mjs';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tbsId: string;
}

function TabsTrigger({ tbsId, children, ...props }: TabsTriggerProps) {
  const context = useTabsContext();
  const isActive = context.tbsId === tbsId;

  // TODO: use ButtonBase with transparent theme
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={(e) => {
        context.tbsOnBtnTabChangeClick(tbsId);
        if (props.onClick) props.onClick(e);
      }}
      /*
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          context.tbsOnBtnTabChangeClick(tbsId);
        }
        if (props.onKeyDown) props.onKeyDown(e);
      }}
      */
      disabled={isActive}
      {...props}
    >
      {children}
    </button>
  );
}

export { TabsTrigger };
export type { TabsTriggerProps };
