'use client';

import { TABS__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import {
  getTabsContentId,
  getTabsTriggerId,
  useTabsContext,
} from './TabsContext.mjs';

const { baseClass: TABS } = TABS__CLASS_NAME_CONFIG;

type TabsTriggerProps = React.ComponentPropsWithRef<'button'> & {
  tbsId: string;
};

/** A tab; only the selected one is in the Tab order (roving tabindex) */
function TabsTrigger({
  tbsId,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const context = useTabsContext();
  const isActive = context.tbsId === tbsId;

  return (
    <button
      type="button"
      role="tab"
      id={getTabsTriggerId(context.tbsBaseId, tbsId)}
      // NOTE: only panels of selected tabs are rendered, so never a dangling reference
      aria-controls={
        isActive ? getTabsContentId(context.tbsBaseId, tbsId) : undefined
      }
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? 'active' : 'inactive'}
      className={cnx(className, `${TABS}__tab`)}
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
