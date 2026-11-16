'use client';

import React from 'react';
import ReactDOMClient from 'react-dom';

import { Backdrop } from '../../elements/Backdrop/index.mjs';
import { useIsClient } from '../../hooks/useIsClient.mjs';
// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { useMainSet } from '../MainSetContext/MainSetContext.mjs';
import {
  useGlobalBodyScrollLock,
  useGlobalEscapeOverlay,
} from './overlay-hooks/index.mjs';

const OVERLAY_CONTAINER_ID = 'ms-overlay__root';

/** Rendered once by `MainSetProvider`: the backdrop, Escape and the page scroll lock */
const OverlayContainer = () => {
  const { overlayStackIds, dismissTopOverlay } = useMainSet();
  const isClient = useIsClient();
  const isAnyOverlayOpen = overlayStackIds.length > 0;

  useGlobalEscapeOverlay(isAnyOverlayOpen, dismissTopOverlay);
  useGlobalBodyScrollLock(isAnyOverlayOpen);

  if (!isClient) return null;

  return ReactDOMClient.createPortal(
    <div id={OVERLAY_CONTAINER_ID}>
      <Backdrop
        bgColor="base"
        bckIsVisible={isAnyOverlayOpen}
        bckOnClick={() => dismissTopOverlay('backdrop')}
      />
    </div>,
    document.body,
  );
};

export { OVERLAY_CONTAINER_ID, OverlayContainer };
