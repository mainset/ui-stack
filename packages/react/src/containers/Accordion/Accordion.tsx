'use client';

import { DISCLOSURE__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

const { baseClass: DISCLOSURE } = DISCLOSURE__CLASS_NAME_CONFIG;

type HeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AccordionContextValue {
  baseId: string;
  headingAs: HeadingTag;
  isOpen: (id: string) => boolean;
  /** Whether the open item may close (`single` + `accIsCollapsible={false}` keeps one open) */
  canClose: (id: string) => boolean;
  toggle: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);
const AccordionItemContext = React.createContext<{
  accId: string;
  accIsDisabled: boolean;
} | null>(null);

function useAccordionItem() {
  const accordion = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);

  if (!accordion || !item) {
    throw new Error('Accordion parts must be used within an <Accordion.Item>');
  }

  const triggerId = `${accordion.baseId}-${item.accId}-trigger`;
  const panelId = `${accordion.baseId}-${item.accId}-panel`;

  return {
    ...accordion,
    ...item,
    triggerId,
    panelId,
    isItemOpen: accordion.isOpen(item.accId),
  };
}

type AccordionProps = Omit<
  React.ComponentPropsWithRef<'div'>,
  'defaultValue'
> & {
  /** `single`: opening an item closes the other one; `multiple`: independent @default 'single' */
  accType?: 'single' | 'multiple';
  /** The items open first (uncontrolled) */
  accDefaultOpenIds?: string[];
  /** The open items (controlled); pair it with {accOnOpenChange} */
  accOpenIds?: string[];
  accOnOpenChange?: (openIds: string[]) => void;
  /** `single` only: whether the open item can be closed, leaving none open @default true */
  accIsCollapsible?: boolean;
  /** The heading level of every item's trigger, to fit the page outline @default 'h3' */
  accHeadingAs?: HeadingTag;
};

/**
 * Expandable sections (WAI-ARIA accordion pattern): each trigger is a button inside a heading,
 * its panel a `region` named by it. Up / Down move between triggers, Home / End jump.
 * Collapsed panels stay in the DOM (`hidden`).
 *
 * @example
 * <Accordion accDefaultOpenIds={['shipping']}>
 *   <Accordion.Item accId="shipping">
 *     <Accordion.Trigger>Shipping</Accordion.Trigger>
 *     <Accordion.Panel>Free over 50 €.</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 */
function AccordionRoot({
  accType = 'single',
  accDefaultOpenIds = [],
  accOpenIds,
  accOnOpenChange,
  accIsCollapsible = true,
  accHeadingAs = 'h3',

  onKeyDown,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledIds, setUncontrolledIds] =
    React.useState(accDefaultOpenIds);
  const openIds = accOpenIds ?? uncontrolledIds;
  const baseId = React.useId();

  const context = React.useMemo<AccordionContextValue>(() => {
    const isOpen = (id: string) => openIds.includes(id);
    const canClose = (id: string) =>
      accType === 'multiple' || accIsCollapsible || !isOpen(id);

    return {
      baseId,
      headingAs: accHeadingAs,
      isOpen,
      canClose: (id) => !isOpen(id) || canClose(id),
      toggle(id) {
        if (isOpen(id) && !canClose(id)) return;

        const nextIds = isOpen(id)
          ? openIds.filter((openId) => openId !== id)
          : accType === 'single'
            ? [id]
            : [...openIds, id];

        if (accOpenIds === undefined) setUncontrolledIds(nextIds);
        accOnOpenChange?.(nextIds);
      },
    };
  }, [
    openIds,
    accType,
    accIsCollapsible,
    accHeadingAs,
    accOpenIds,
    accOnOpenChange,
    baseId,
  ]);

  // Up / Down / Home / End between this accordion's own triggers (optional in WAI-ARIA, handy)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const root = event.currentTarget;
    const triggers = [
      ...root.querySelectorAll<HTMLButtonElement>(`.${DISCLOSURE}__trigger`),
    ].filter(
      (trigger) =>
        !trigger.disabled && trigger.closest('[data-ms-accordion]') === root,
    );
    const currentIndex = triggers.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (currentIndex === -1) return;

    const targetIndexByKey: Record<string, number> = {
      ArrowDown: (currentIndex + 1) % triggers.length,
      ArrowUp: (currentIndex - 1 + triggers.length) % triggers.length,
      Home: 0,
      End: triggers.length - 1,
    };
    const targetIndex = targetIndexByKey[event.key];
    if (targetIndex === undefined) return;

    event.preventDefault();
    triggers[targetIndex].focus();
  };

  return (
    <AccordionContext.Provider value={context}>
      <div data-ms-accordion="" onKeyDown={handleKeyDown} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentPropsWithRef<'div'> & {
  accId: string;
  accIsDisabled?: boolean;
};

/** One section: an `Accordion.Trigger` and its `Accordion.Panel` */
function AccordionItem({
  accId,
  accIsDisabled = false,
  className,
  ...props
}: AccordionItemProps) {
  const item = React.useMemo(
    () => ({ accId, accIsDisabled }),
    [accId, accIsDisabled],
  );
  const accordion = React.useContext(AccordionContext);

  return (
    <AccordionItemContext.Provider value={item}>
      <div
        className={cnx(className, DISCLOSURE)}
        data-state={accordion?.isOpen(accId) ? 'open' : 'closed'}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = React.ComponentPropsWithRef<'button'>;

/** The item's heading + button (the heading level comes from `accHeadingAs`) */
function AccordionTrigger({
  className,
  children,
  onClick,
  ...props
}: AccordionTriggerProps) {
  const {
    headingAs,
    triggerId,
    panelId,
    isItemOpen,
    canClose,
    toggle,
    accId,
    accIsDisabled,
  } = useAccordionItem();

  return React.createElement(
    headingAs,
    { className: `${DISCLOSURE}__heading` },
    <button
      type="button"
      id={triggerId}
      aria-expanded={isItemOpen}
      aria-controls={panelId}
      // NOTE: the open item of a non-collapsible accordion can't close (WAI-ARIA)
      aria-disabled={isItemOpen && !canClose(accId) ? true : undefined}
      disabled={accIsDisabled}
      className={cnx(className, `${DISCLOSURE}__trigger`)}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle(accId);
      }}
    >
      {children}
      <span className={`${DISCLOSURE}__icon`} aria-hidden="true" />
    </button>,
  );
}

type AccordionPanelProps = React.ComponentPropsWithRef<'div'>;

/** The item's content: a `region` named by its trigger, `hidden` while collapsed */
function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  const { triggerId, panelId, isItemOpen } = useAccordionItem();

  return (
    <div
      role="region"
      id={panelId}
      aria-labelledby={triggerId}
      hidden={!isItemOpen}
      className={cnx(className, `${DISCLOSURE}__panel`)}
      {...props}
    />
  );
}

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
});

export { Accordion };
export type {
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionTriggerProps,
};
