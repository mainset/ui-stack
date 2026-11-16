'use client';

import type { OverlayStyleProps } from '@mainset/ui-core';
import {
  OVERLAY__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';
import ReactDOMClient from 'react-dom';

import { mergeRefs } from '../../elements/utils/index.mjs';
import { useIsClient } from '../../hooks/useIsClient.mjs';
import { usePresence } from '../../hooks/usePresence.mjs';
// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { useMainSet } from '../MainSetContext/MainSetContext.mjs';
import { OVERLAY_CONTAINER_ID } from './OverlayContainer.js';
import { useFocusReturn, useFocusTrap } from './overlay-hooks/index.mjs';

type OverlayContentProps = Omit<React.ComponentPropsWithRef<'div'>, 'role'> &
  OverlayStyleProps & {
    /**
     * Opens it from anywhere with `useOverlay(ovrId).open()` / `openOverlayById(ovrId)`,
     * when {ovrIsOpen} isn't given
     */
    ovrId?: string;
    /** Controlled open state; without it, the provider's state for {ovrId} */
    ovrIsOpen?: boolean;
    /** Escape, a backdrop click or a close button asks to close: `false` */
    ovrOnOpenChange?: (isOpen: boolean) => void;
    /**
     * WAI-ARIA role; give it an accessible name (`aria-label` / `aria-labelledby`)
     * @default 'dialog'
     */
    ovrRole?: 'dialog' | 'alertdialog';
    /**
     * Whether a backdrop click closes it
     * @default true, `false` for an `alertdialog`
     */
    ovrIsBackdropDismissable?: boolean;
  };

/**
 * The behaviour of every modal overlay (dialog, drawer): a portal above the backdrop, on the
 * provider's overlay stack (Escape and a backdrop click close the top one), focus trapped while
 * it's on top and given back on close, the page scroll locked, `data-state` for the enter / exit
 * animation. The panel itself is unstyled: `Dialog` and `Drawer` add the looks.
 */
function OverlayContent({
  ovrId,
  ovrIsOpen,
  ovrOnOpenChange,
  ovrRole = 'dialog',
  ovrIsBackdropDismissable = ovrRole !== 'alertdialog',

  ref,
  children,
  ...props
}: OverlayContentProps) {
  const {
    isOverlayOpenById,
    overlayStackIds,
    closeOverlayById,
    registerOverlay,
  } = useMainSet();
  const isClient = useIsClient();

  const generatedId = React.useId();
  const id = ovrId ?? generatedId;
  const isOpen = ovrIsOpen ?? isOverlayOpenById[id] ?? false;

  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const setPanelRef = React.useMemo(() => mergeRefs(panelRef, ref), [ref]);
  const { isMounted, state } = usePresence(isOpen, panelRef);

  // Latest callbacks, so the registration doesn't change with every render
  const dismissRef = React.useRef<() => void>(() => undefined);
  React.useLayoutEffect(() => {
    dismissRef.current = () => {
      ovrOnOpenChange?.(false);
      if (ovrIsOpen === undefined) closeOverlayById(id);
    };
  });

  React.useLayoutEffect(() => {
    if (!isOpen) return;

    return registerOverlay(id, {
      onDismiss: () => dismissRef.current(),
      isBackdropDismissable: ovrIsBackdropDismissable,
    });
  }, [id, isOpen, ovrIsBackdropDismissable, registerOverlay]);

  const isTopOverlay = overlayStackIds[overlayStackIds.length - 1] === id;
  useFocusTrap(panelRef, isOpen && isTopOverlay);
  useFocusReturn(isOpen);

  const [overlayClassNames, panelProps] = extractClassNamesFromProps(
    [OVERLAY__CLASS_NAME_CONFIG],
    props,
  );

  if (!isClient || !isMounted) return null;

  return ReactDOMClient.createPortal(
    <div className={cnx(overlayClassNames)}>
      <div
        role={ovrRole}
        aria-modal="true"
        // NOTE: lets the focus trap fall back to the panel when it has nothing focusable
        tabIndex={-1}
        data-state={state}
        {...panelProps}
        ref={setPanelRef}
      >
        {children}
      </div>
    </div>,
    document.getElementById(OVERLAY_CONTAINER_ID) || document.body,
  );
}

export { OverlayContent };
export type { OverlayContentProps };
