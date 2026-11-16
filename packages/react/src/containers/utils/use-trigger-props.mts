'use client';

import React from 'react';

import { mergeRefs } from '../../elements/utils/index.mjs';

type TriggerElement = React.ReactElement<
  Record<string, unknown> & { ref?: React.Ref<HTMLElement> }
>;

type EventHandler = (event: React.SyntheticEvent) => void;

/**
 * Adds props to the single child that triggers a popover / tooltip / menu: a merged `ref`,
 * attributes, and event handlers composed with the child's own (the child's run first; one that
 * calls `preventDefault()` skips ours).
 */
function useTriggerElement(
  children: React.ReactNode,
  ref: React.Ref<HTMLElement>,
  props: Record<string, unknown>,
  handlers: Record<string, EventHandler>,
) {
  const child = React.Children.only(children) as TriggerElement;
  const childRef = child.props.ref;
  const mergedRef = React.useMemo(
    () => mergeRefs(childRef, ref),
    [childRef, ref],
  );

  const composedHandlers = Object.fromEntries(
    Object.entries(handlers).map(([name, handler]) => [
      name,
      (event: React.SyntheticEvent) => {
        (child.props[name] as EventHandler | undefined)?.(event);
        if (!event.defaultPrevented) handler(event);
      },
    ]),
  );

  return React.cloneElement(child, {
    ...props,
    ...composedHandlers,
    ref: mergedRef,
  });
}

export { useTriggerElement };
