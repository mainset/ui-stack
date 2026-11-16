'use client';

import { POPOVER__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import { mergeRefs } from '../../elements/utils/index.mjs';
import { usePresence } from '../../hooks/usePresence.mjs';
import { getFocusableNodes } from '../Overlay/overlay-hooks/index.mjs';
import type {
  FloatingAlign,
  FloatingSide,
} from '../utils/use-floating-position.mjs';
import { useFloatingPosition } from '../utils/use-floating-position.mjs';
import { useTriggerElement } from '../utils/use-trigger-props.mjs';

const { baseClass: POPOVER } = POPOVER__CLASS_NAME_CONFIG;

type PopoverContextValue = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  floating: ReturnType<typeof useFloatingPosition>;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const usePopover = () => {
  const context = React.useContext(PopoverContext);

  if (!context) {
    throw new Error('Popover parts must be used within a <Popover>');
  }

  return context;
};

interface PopoverProps {
  children?: React.ReactNode;
  /** Controlled open state; pair it with {popOnOpenChange} */
  popIsOpen?: boolean;
  /** Open on first render (uncontrolled) */
  popDefaultIsOpen?: boolean;
  popOnOpenChange?: (isOpen: boolean) => void;
  /** The side of the trigger it opens on; `start` / `end` follow `dir` @default 'bottom' */
  popPlacement?: FloatingSide;
  /** @default 'start' */
  popAlign?: FloatingAlign;
}

/**
 * A non-modal panel attached to its trigger (filters, a small form, details). Opens on click,
 * moves the focus inside; Escape closes it and returns the focus to the trigger; a click outside
 * or moving the focus away closes it too. Flips / shifts to stay on screen.
 *
 * @example
 * <Popover popPlacement="bottom" popAlign="end">
 *   <Popover.Trigger>
 *     <Button>Filters</Button>
 *   </Popover.Trigger>
 *   <Popover.Content aria-label="Filters">…</Popover.Content>
 * </Popover>
 */
function PopoverRoot({
  children,
  popIsOpen,
  popDefaultIsOpen = false,
  popOnOpenChange,
  popPlacement = 'bottom',
  popAlign = 'start',
}: PopoverProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] =
    React.useState(popDefaultIsOpen);
  const isOpen = popIsOpen ?? uncontrolledIsOpen;
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const floating = useFloatingPosition({
    isOpen,
    side: popPlacement,
    align: popAlign,
  });

  const setIsOpen = React.useCallback(
    (nextIsOpen: boolean) => {
      if (popIsOpen === undefined) setUncontrolledIsOpen(nextIsOpen);
      popOnOpenChange?.(nextIsOpen);
    },
    [popIsOpen, popOnOpenChange],
  );

  const context = React.useMemo(
    () => ({ isOpen, setIsOpen, contentId, triggerRef, floating }),
    [isOpen, setIsOpen, contentId, floating],
  );

  return (
    <PopoverContext.Provider value={context}>
      {children}
    </PopoverContext.Provider>
  );
}

/** Wraps the one element that opens it (a `Button`); it gets the ARIA state and the handlers */
function PopoverTrigger({ children }: { children: React.ReactElement }) {
  const { isOpen, setIsOpen, contentId, triggerRef, floating } = usePopover();
  const ref = React.useMemo(
    () => mergeRefs<HTMLElement>(triggerRef, floating.refs.setReference),
    [triggerRef, floating.refs.setReference],
  );

  return useTriggerElement(
    children,
    ref,
    {
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? contentId : undefined,
    },
    { onClick: () => setIsOpen(!isOpen) },
  );
}

type PopoverContentProps = React.ComponentPropsWithRef<'div'>;

/** The panel: `role="dialog"`, name it with `aria-label` / `aria-labelledby` */
function PopoverContent({
  className,
  style,
  onKeyDown,
  onBlur,
  ref,
  children,
  ...props
}: PopoverContentProps) {
  const { isOpen, setIsOpen, contentId, triggerRef, floating } = usePopover();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const { isMounted, state } = usePresence(isOpen, contentRef);
  const setContentRef = React.useMemo(
    () => mergeRefs(contentRef, floating.refs.setFloating, ref),
    [floating.refs.setFloating, ref],
  );

  // Moves the focus inside once it's open
  React.useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => {
      const node = contentRef.current;
      if (!node || node.contains(document.activeElement)) return;

      const autoFocusNode = node.querySelector<HTMLElement>(
        '[autofocus], [data-autofocus]',
      );
      (autoFocusNode || getFocusableNodes(node)[0] || node).focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  // A press outside (trigger excluded: it toggles) closes it
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: Event) => {
      const target = event.target as Node;
      if (
        contentRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;

      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, setIsOpen, triggerRef]);

  if (!isMounted) return null;

  return (
    <div
      id={contentId}
      role="dialog"
      tabIndex={-1}
      data-state={state}
      data-placement={floating.placement}
      className={cnx(className, POPOVER)}
      style={{ ...floating.floatingStyles, ...style }}
      {...props}
      ref={setContentRef}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== 'Escape') return;

        // NOTE: handled, so a dialog around it stays open
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        const nextFocus = event.relatedTarget as Node | null;
        // NOTE: `null` is the window losing focus (another tab, devtools): stays open
        if (
          nextFocus &&
          !event.currentTarget.contains(nextFocus) &&
          !triggerRef.current?.contains(nextFocus)
        ) {
          setIsOpen(false);
        }
      }}
    >
      {children}
    </div>
  );
}

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export { Popover };
export type { PopoverContentProps, PopoverProps };
