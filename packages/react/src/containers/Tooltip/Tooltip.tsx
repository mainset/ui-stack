'use client';

import { TOOLTIP__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type {
  FloatingAlign,
  FloatingSide,
} from '../utils/use-floating-position.mjs';
import { useFloatingPosition } from '../utils/use-floating-position.mjs';
import { useTriggerElement } from '../utils/use-trigger-props.mjs';

const { baseClass: TOOLTIP } = TOOLTIP__CLASS_NAME_CONFIG;

// The pointer can move from the trigger onto the tooltip within this time (WCAG 1.4.13 hoverable)
const TOOLTIP__HIDE_DELAY = 100;

interface TooltipProps {
  /** One focusable element: a `Button`, a link */
  children: React.ReactElement;
  /** A short description; announced as the trigger's description (`aria-describedby`) */
  tipContent: React.ReactNode;
  /** @default 'top' */
  tipPlacement?: FloatingSide;
  /** @default 'center' */
  tipAlign?: FloatingAlign;
  /** Delay before it shows on hover, in ms (focus shows it right away) @default 400 */
  tipDelay?: number;
  tipIsDisabled?: boolean;
  className?: string;
}

/**
 * A short description of its trigger, on hover and on keyboard focus. Stays while the pointer
 * is over it; Escape hides it without moving the focus (WCAG 1.4.13). It describes, so an icon
 * button still needs its own `aria-label`. Disabled buttons fire no pointer events: wrap them.
 *
 * @example
 * <Tooltip tipContent="Copy link">
 *   <Button btnIsIcon aria-label="Copy link"><CopyIcon /></Button>
 * </Tooltip>
 */
function Tooltip({
  children,
  tipContent,
  tipPlacement = 'top',
  tipAlign = 'center',
  tipDelay = 400,
  tipIsDisabled = false,
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isShown = isOpen && !tipIsDisabled;
  const tooltipId = React.useId();
  const floating = useFloatingPosition({
    isOpen: isShown,
    side: tipPlacement,
    align: tipAlign,
    distance: 6,
  });
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const schedule = React.useCallback((nextIsOpen: boolean, delay: number) => {
    clearTimeout(timeoutRef.current);
    if (delay > 0)
      timeoutRef.current = setTimeout(() => setIsOpen(nextIsOpen), delay);
    else setIsOpen(nextIsOpen);
  }, []);

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // Escape hides it. NOTE: in the capture phase, so it runs before (and stops) a dialog's Escape
  React.useEffect(() => {
    if (!isShown) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      schedule(false, 0);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isShown, schedule]);

  const child = children as React.ReactElement<{ 'aria-describedby'?: string }>;
  const trigger = useTriggerElement(
    children,
    floating.refs.setReference,
    { 'aria-describedby': cnx(child.props['aria-describedby'], tooltipId) },
    {
      onPointerEnter: () => schedule(true, tipDelay),
      onPointerLeave: () => schedule(false, TOOLTIP__HIDE_DELAY),
      onFocus: () => schedule(true, 0),
      onBlur: () => schedule(false, 0),
    },
  );

  return (
    <>
      {trigger}
      <div
        id={tooltipId}
        role="tooltip"
        // NOTE: always rendered, so `aria-describedby` resolves while it's hidden too
        hidden={!isShown}
        ref={floating.refs.setFloating}
        className={cnx(className, TOOLTIP)}
        style={isShown ? floating.floatingStyles : undefined}
        onPointerEnter={() => schedule(true, 0)}
        onPointerLeave={() => schedule(false, TOOLTIP__HIDE_DELAY)}
      >
        {tipContent}
      </div>
    </>
  );
}

export { Tooltip };
export type { TooltipProps };
