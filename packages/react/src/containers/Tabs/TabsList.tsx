'use client';

import { TABS__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { isRtl } from '../../elements/utils/index.mjs';
import { useTabsContext } from './TabsContext.mjs';

const { baseClass: TABS } = TABS__CLASS_NAME_CONFIG;

type TabsListProps = React.ComponentPropsWithRef<'div'>;

/** The `tablist`: name it with `aria-label` (or `aria-labelledby`) */
function TabsList({ className, onKeyDown, ...props }: TabsListProps) {
  const { tbsOrientation, tbsActivation } = useTabsContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const list = event.currentTarget;
    // NOTE: its own tabs only, not those of tabs nested in a panel
    const tabs = [
      ...list.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    ].filter(
      (tab) => !tab.disabled && tab.closest('[role="tablist"]') === list,
    );
    const currentIndex = tabs.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (currentIndex === -1) return;

    const isVertical = tbsOrientation === 'vertical';
    const isReversed = !isVertical && isRtl(list);
    const nextKey = isVertical
      ? 'ArrowDown'
      : isReversed
        ? 'ArrowLeft'
        : 'ArrowRight';
    const previousKey = isVertical
      ? 'ArrowUp'
      : isReversed
        ? 'ArrowRight'
        : 'ArrowLeft';

    const targetIndexByKey: Record<string, number> = {
      [nextKey]: (currentIndex + 1) % tabs.length,
      [previousKey]: (currentIndex - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const targetIndex = targetIndexByKey[event.key];
    if (targetIndex === undefined) return;

    event.preventDefault();
    const target = tabs[targetIndex];
    target.focus();
    if (tbsActivation === 'auto') target.click();
  };

  return (
    <div
      role="tablist"
      aria-orientation={tbsOrientation}
      className={cnx(className, `${TABS}__list`)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { TabsList };
export type { TabsListProps };
