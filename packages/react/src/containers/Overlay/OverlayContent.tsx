'use client';

import React from 'react';
import ReactDOMClient from 'react-dom';

import { Presence } from '../../components/Presence/index.mjs';
import { Flex } from '../../elements/Flex/index.mjs';
// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { useMainSet } from '../MainSetContext/MainSetContext.mjs';
import { OVERLAY_CONTAINER_ID } from './OverlayContainer.js';
import { useFocusTrap } from './overlay-hooks/index.mjs';
import './overlay-normalize.scss';

interface OverlayContentProps
  extends
    React.PropsWithChildren,
    Pick<
      React.AriaAttributes,
      'aria-label' | 'aria-labelledby' | 'aria-describedby'
    > {
  ovrId: string; // Add id to know if it's the top-most modal
  ovrIsOpen: boolean;
  ovrPlacement?: 'middle' | 'start' | 'end';
  /**
   * WAI-ARIA role of the overlay; modal overlays must expose `dialog` (or `alertdialog`)
   * together with an accessible name ({aria-label} or {aria-labelledby})
   * @default 'dialog'
   */
  ovrRole?: 'dialog' | 'alertdialog';
}

const FLEX_PROPS__BY_OVERLAY_PLACEMENT = {
  middle: { layAlign: 'center', layJustify: 'center' },
  start: {},
  end: { layJustify: 'flex-end' },
} as const;

const OverlayContent = ({
  ovrId,
  ovrIsOpen,
  ovrPlacement = 'middle',
  ovrRole = 'dialog',
  children,
  ...ariaProps
}: OverlayContentProps) => {
  const { overlayStackIds } = useMainSet();

  const isTopOverlay = overlayStackIds[overlayStackIds.length - 1] === ovrId;
  const contentRef = React.useRef<HTMLDivElement>(null);

  useFocusTrap(contentRef, ovrIsOpen && isTopOverlay);

  const portalNode = React.useMemo(() => {
    if (typeof window === 'undefined') return null;

    const overlayRoot =
      window.document.getElementById(OVERLAY_CONTAINER_ID) ||
      window.document.body;

    // We wrap {children} in a single un-styled container div strictly for the focus trap ref
    const wrappedChildren = (
      <Flex
        ref={contentRef}
        className="ms-overlay__content-positioner"
        role={ovrRole}
        aria-modal="true"
        // NOTE: lets the focus trap fall back to the container when content has no focusable nodes
        tabIndex={-1}
        {...ariaProps}
        {...FLEX_PROPS__BY_OVERLAY_PLACEMENT[ovrPlacement]}
      >
        {children}
      </Flex>
    );

    return ReactDOMClient.createPortal(wrappedChildren, overlayRoot);
  }, [
    children,
    ovrPlacement,
    ovrRole,
    ariaProps['aria-label'],
    ariaProps['aria-labelledby'],
    ariaProps['aria-describedby'],
  ]);

  return <Presence prsIsMounted={ovrIsOpen}>{portalNode}</Presence>;
};

export { OverlayContent };
