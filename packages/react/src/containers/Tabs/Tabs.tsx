'use client';

import type { TabsStyleProps } from '@mainset/ui-core';
import {
  TABS__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import { TabsContent } from './TabsContent.js';
import { TabsProvider } from './TabsContext.mjs';
import { TabsList } from './TabsList.js';
import { TabsTrigger } from './TabsTrigger.js';

type TabsProps = Omit<React.ComponentPropsWithRef<'div'>, 'onChange'> &
  TabsStyleProps & {
    /** The tab selected first (uncontrolled) */
    tbsDefaultId: string;
    /** The selected tab (controlled); pair it with {tbsOnBtnTabChangeClick} */
    tbsControllerId?: string;
    tbsOnBtnTabChangeClick?: (id: string) => void;
    /**
     * `auto`: arrow keys select the tab they move to (panels that render fast);
     * `manual`: they only move the focus, Enter / Space select
     * @default 'auto'
     */
    tbsActivation?: 'auto' | 'manual';
  };

/**
 * Tabs (WAI-ARIA tabs pattern): `Tabs.List` of `Tabs.Trigger`s, one `Tabs.Content` per tab.
 * Arrow keys move between tabs (mirrored in RTL sections), Home / End jump to the first / last;
 * only the selected tab is in the Tab order.
 *
 * @example
 * <Tabs tbsDefaultId="profile">
 *   <Tabs.List aria-label="Account">
 *     <Tabs.Trigger tbsId="profile">Profile</Tabs.Trigger>
 *     <Tabs.Trigger tbsId="billing">Billing</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content tbsId="profile">…</Tabs.Content>
 *   <Tabs.Content tbsId="billing">…</Tabs.Content>
 * </Tabs>
 */
function TabsComponent({
  tbsDefaultId,
  tbsControllerId: controlledId,
  tbsOnBtnTabChangeClick,
  tbsOrientation = 'horizontal',
  tbsActivation = 'auto',

  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledId, setUncontrolledId] = React.useState(
    tbsDefaultId || '',
  );

  const isControlled = controlledId !== undefined;
  const resolvedTbsId = isControlled ? controlledId : uncontrolledId;

  const handleIdChange = React.useCallback(
    (newId: string) => {
      if (!isControlled) {
        setUncontrolledId(newId);
      }

      tbsOnBtnTabChangeClick?.(newId);
    },
    [isControlled, tbsOnBtnTabChangeClick],
  );

  const tbsBaseId = React.useId();
  const [classNames, restProps] = extractClassNamesFromProps(
    [TABS__CLASS_NAME_CONFIG],
    { tbsOrientation, ...props },
  );

  const context = React.useMemo(
    () => ({
      tbsId: resolvedTbsId,
      tbsOnBtnTabChangeClick: handleIdChange,
      tbsOrientation,
      tbsActivation,
      tbsBaseId,
    }),
    [resolvedTbsId, handleIdChange, tbsOrientation, tbsActivation, tbsBaseId],
  );

  return (
    <TabsProvider value={context}>
      <div className={cnx(className, classNames)} {...restProps}>
        {children}
      </div>
    </TabsProvider>
  );
}

const Tabs = Object.assign(TabsComponent, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs };
export type { TabsProps };
