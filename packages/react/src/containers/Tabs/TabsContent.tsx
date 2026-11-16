'use client';

import { TABS__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import {
  getTabsContentId,
  getTabsTriggerId,
  useTabsContext,
} from './TabsContext.mjs';

const { baseClass: TABS } = TABS__CLASS_NAME_CONFIG;

type TabsContentProps = React.ComponentPropsWithRef<'div'> & {
  tbsId: string;
};

/** The panel of a tab, rendered while its tab is selected */
function TabsContent({
  tbsId,
  className,
  children,
  ...props
}: TabsContentProps) {
  const context = useTabsContext();

  if (context.tbsId !== tbsId) return null;

  return (
    <div
      role="tabpanel"
      id={getTabsContentId(context.tbsBaseId, tbsId)}
      aria-labelledby={getTabsTriggerId(context.tbsBaseId, tbsId)}
      tabIndex={0}
      data-state="active"
      className={cnx(className, `${TABS}__panel`)}
      {...props}
    >
      {children}
    </div>
  );
}

export { TabsContent };
export type { TabsContentProps };
