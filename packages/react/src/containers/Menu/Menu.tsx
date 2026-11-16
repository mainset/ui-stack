'use client';

import type { Tone } from '@mainset/ui-core';
import {
  MENU__CLASS_NAME_CONFIG,
  POPOVER__CLASS_NAME_CONFIG,
  cnx,
  toneRecipe,
} from '@mainset/ui-core';
import React from 'react';

import type {
  AnyComponent,
  PolymorphicProps,
} from '../../elements/utils/index.mjs';
import { mergeRefs } from '../../elements/utils/index.mjs';
import { usePresence } from '../../hooks/usePresence.mjs';
import type {
  FloatingAlign,
  FloatingSide,
} from '../utils/use-floating-position.mjs';
import { useFloatingPosition } from '../utils/use-floating-position.mjs';
import { useTriggerElement } from '../utils/use-trigger-props.mjs';

const { baseClass: MENU } = MENU__CLASS_NAME_CONFIG;
const { baseClass: POPOVER } = POPOVER__CLASS_NAME_CONFIG;

// Typed characters within this time form one typeahead search
const TYPEAHEAD__RESET_MS = 500;

type InitialFocus = 'first' | 'last';

interface MenuContextValue {
  isOpen: boolean;
  open: (initialFocus: InitialFocus) => void;
  /** Closes it; `returnFocus` puts the focus back on the trigger (Escape, a selection) */
  close: (returnFocus: boolean) => void;
  initialFocus: InitialFocus;
  triggerId: string;
  listId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  floating: ReturnType<typeof useFloatingPosition>;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

const useMenu = () => {
  const context = React.useContext(MenuContext);

  if (!context) {
    throw new Error('Menu parts must be used within a <Menu>');
  }

  return context;
};

interface MenuProps {
  children?: React.ReactNode;
  /** Controlled open state; pair it with {mnuOnOpenChange} */
  mnuIsOpen?: boolean;
  mnuOnOpenChange?: (isOpen: boolean) => void;
  /** The side of the trigger it opens on; `start` / `end` follow `dir` @default 'bottom' */
  mnuPlacement?: FloatingSide;
  /** @default 'start' */
  mnuAlign?: FloatingAlign;
}

/**
 * A menu button (WAI-ARIA menu button pattern): the trigger opens a list of actions.
 * Enter / Space / Down open it on the first item, Up on the last; Up / Down / Home / End move,
 * typing jumps to an item by its text; Enter / Space / a click select and close it, returning
 * the focus to the trigger; Escape closes it, Tab closes it and moves on.
 *
 * @example
 * <Menu>
 *   <Menu.Trigger>
 *     <Button>Actions</Button>
 *   </Menu.Trigger>
 *   <Menu.List>
 *     <Menu.Item mnuOnSelect={rename}>Rename</Menu.Item>
 *     <Menu.Item mnuAs="a" href="/export">Export</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item mnuTone="error" mnuOnSelect={remove}>Delete</Menu.Item>
 *   </Menu.List>
 * </Menu>
 */
function MenuRoot({
  children,
  mnuIsOpen,
  mnuOnOpenChange,
  mnuPlacement = 'bottom',
  mnuAlign = 'start',
}: MenuProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const [initialFocus, setInitialFocus] = React.useState<InitialFocus>('first');
  const isOpen = mnuIsOpen ?? uncontrolledIsOpen;
  const baseId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const floating = useFloatingPosition({
    isOpen,
    side: mnuPlacement,
    align: mnuAlign,
    distance: 4,
  });

  const setIsOpen = React.useCallback(
    (nextIsOpen: boolean) => {
      if (mnuIsOpen === undefined) setUncontrolledIsOpen(nextIsOpen);
      mnuOnOpenChange?.(nextIsOpen);
    },
    [mnuIsOpen, mnuOnOpenChange],
  );

  const context = React.useMemo<MenuContextValue>(
    () => ({
      isOpen,
      open(nextInitialFocus) {
        setInitialFocus(nextInitialFocus);
        setIsOpen(true);
      },
      close(returnFocus) {
        setIsOpen(false);
        if (returnFocus) triggerRef.current?.focus();
      },
      initialFocus,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      triggerRef,
      floating,
    }),
    [isOpen, setIsOpen, initialFocus, baseId, floating],
  );

  return (
    <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
  );
}

/** Wraps the one element that opens it (a `Button`) */
function MenuTrigger({ children }: { children: React.ReactElement }) {
  const { isOpen, open, close, triggerId, listId, triggerRef, floating } =
    useMenu();
  const ref = React.useMemo(
    () => mergeRefs<HTMLElement>(triggerRef, floating.refs.setReference),
    [triggerRef, floating.refs.setReference],
  );

  return useTriggerElement(
    children,
    ref,
    {
      id: triggerId,
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? listId : undefined,
    },
    {
      onClick: () => (isOpen ? close(false) : open('first')),
      onKeyDown(event) {
        const { key } = event as React.KeyboardEvent;
        if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

        event.preventDefault();
        open(key === 'ArrowUp' ? 'last' : 'first');
      },
    },
  );
}

// This menu's own items, not those of a nested one
const getItems = (list: HTMLElement) =>
  [...list.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(
    (item) => item.closest('[role="menu"]') === list,
  );

type MenuListProps = React.ComponentPropsWithRef<'div'>;

/** The `menu` panel; named by its trigger unless given `aria-label` */
function MenuList({
  className,
  style,
  onKeyDown,
  onBlur,
  ref,
  children,
  ...props
}: MenuListProps) {
  const {
    isOpen,
    close,
    initialFocus,
    triggerId,
    listId,
    triggerRef,
    floating,
  } = useMenu();
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const { isMounted, state } = usePresence(isOpen, listRef);
  const setListRef = React.useMemo(
    () => mergeRefs(listRef, floating.refs.setFloating, ref),
    [floating.refs.setFloating, ref],
  );
  const typeaheadRef = React.useRef({
    query: '',
    timeoutId: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  // The first / last item gets the focus once it's open
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!isOpen || !list) return;

    const items = getItems(list);
    // NOTE: no scrolling to it before it's positioned
    (initialFocus === 'last' ? items[items.length - 1] : items[0])?.focus({
      preventScroll: true,
    });
  }, [isOpen, initialFocus]);

  // A press outside (trigger excluded: it toggles) closes it
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: Event) => {
      const target = event.target as Node;
      if (
        listRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;

      close(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, close, triggerRef]);

  React.useEffect(() => () => clearTimeout(typeaheadRef.current.timeoutId), []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const items = getItems(event.currentTarget);
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (index: number) => items[index]?.focus();

    switch (event.key) {
      case 'ArrowDown':
        focusAt((currentIndex + 1) % items.length);
        break;
      case 'ArrowUp':
        focusAt((currentIndex - 1 + items.length) % items.length);
        break;
      case 'Home':
        focusAt(0);
        break;
      case 'End':
        focusAt(items.length - 1);
        break;
      case 'Escape':
        // NOTE: handled, so a dialog around it stays open
        close(true);
        break;
      case 'Tab':
        // Moves on to what follows the trigger, as the menu sits right after it
        close(false);
        return;
      case ' ':
        // Links don't react to Space natively
        if (currentIndex !== -1 && items[currentIndex].tagName !== 'BUTTON') {
          items[currentIndex].click();
          break;
        }

        return;
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return;

        // Typeahead: the next item whose text starts with what was typed
        const typeahead = typeaheadRef.current;
        clearTimeout(typeahead.timeoutId);
        typeahead.query += event.key.toLowerCase();
        typeahead.timeoutId = setTimeout(() => {
          typeahead.query = '';
        }, TYPEAHEAD__RESET_MS);

        const ordered = [
          ...items.slice(currentIndex + 1),
          ...items.slice(0, currentIndex + 1),
        ];
        // NOTE: repeating one letter cycles through the items starting with it
        const query = /^(.)\1+$/.test(typeahead.query)
          ? typeahead.query[0]
          : typeahead.query;
        ordered
          .find((item) =>
            item.textContent?.trim().toLowerCase().startsWith(query),
          )
          ?.focus();
      }
    }

    event.preventDefault();
  };

  if (!isMounted) return null;

  return (
    <div
      id={listId}
      role="menu"
      aria-labelledby={props['aria-label'] ? undefined : triggerId}
      tabIndex={-1}
      data-state={state}
      data-placement={floating.placement}
      className={cnx(className, POPOVER, MENU)}
      style={{ ...floating.floatingStyles, ...style }}
      {...props}
      ref={setListRef}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        onBlur?.(event);
        const nextFocus = event.relatedTarget as Node | null;
        if (
          nextFocus &&
          !event.currentTarget.contains(nextFocus) &&
          !triggerRef.current?.contains(nextFocus)
        ) {
          close(false);
        }
      }}
    >
      {children}
    </div>
  );
}

type MenuItemElementType = 'button' | 'a' | AnyComponent;

type MenuItemProps<C extends MenuItemElementType = 'button'> = PolymorphicProps<
  'mnuAs',
  C,
  {
    /** Runs on a click / Enter / Space, then the menu closes; `preventDefault()` keeps it open */
    mnuOnSelect?: (event: React.MouseEvent) => void;
    /** Focusable but not selectable (WAI-ARIA): announced as unavailable */
    mnuIsDisabled?: boolean;
    /** Colors the item, e.g. `error` for a destructive action */
    mnuTone?: Tone;
  }
>;

/** An action: a button, or a link with `mnuAs="a"` (or a router link) */
function MenuItem<C extends MenuItemElementType = 'button'>({
  mnuAs,
  mnuOnSelect,
  mnuIsDisabled,
  mnuTone,

  className,
  onClick,
  onPointerMove,
  ...props
}: MenuItemProps<C>) {
  const { close } = useMenu();
  const Component = mnuAs || 'button';

  return React.createElement(Component, {
    role: 'menuitem',
    tabIndex: -1,
    ...(Component === 'button' ? { type: 'button' } : null),
    'aria-disabled': mnuIsDisabled || undefined,
    className: cnx(
      className,
      `${MENU}__item`,
      mnuTone && [`${MENU}__item--toned`, toneRecipe(mnuTone)],
    ),
    ...props,
    // NOTE: the pointer moves the highlight (the focus), as the arrow keys do
    onPointerMove(event: React.PointerEvent<HTMLElement>) {
      onPointerMove?.(event);
      if (document.activeElement !== event.currentTarget)
        event.currentTarget.focus();
    },
    onClick(event: React.MouseEvent<HTMLElement>) {
      if (mnuIsDisabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
      mnuOnSelect?.(event);
      if (!event.defaultPrevented) close(true);
    },
  });
}

/** A line between groups of items */
function MenuSeparator({
  className,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      role="separator"
      className={cnx(className, `${MENU}__separator`)}
      {...props}
    />
  );
}

type MenuGroupProps = React.ComponentPropsWithRef<'div'> & {
  /** A visible label naming the group */
  mnuLabel: React.ReactNode;
};

/** Related items under a label */
function MenuGroup({ mnuLabel, children, ...props }: MenuGroupProps) {
  const labelId = React.useId();

  return (
    <div role="group" aria-labelledby={labelId} {...props}>
      <div id={labelId} className={`${MENU}__group-label`} aria-hidden="true">
        {mnuLabel}
      </div>
      {children}
    </div>
  );
}

const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  List: MenuList,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
});

export { Menu };
export type { MenuGroupProps, MenuItemProps, MenuListProps, MenuProps };
