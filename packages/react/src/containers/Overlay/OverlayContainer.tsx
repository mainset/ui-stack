import { Backdrop } from '@mainset/react/elements';
import React from 'react';
import ReactDOMClient from 'react-dom';

// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { useMainSet } from '../MainSetContext/MainSetContext.mjs';
import {
  useGlobalBodyScrollLock,
  useGlobalEscapeOverlay,
} from './overlay-hooks/index.mjs';

const OVERLAY_CONTAINER_ID = 'ms-overlay__root';

const OverlayContainer = () => {
  const { overlayStackIds, toggleOverlayOpenById } = useMainSet();

  // Apply side-effects based on active overlays
  useGlobalEscapeOverlay(overlayStackIds, toggleOverlayOpenById);
  useGlobalBodyScrollLock(overlayStackIds.length > 0);

  const handleBackdropClick = React.useCallback(() => {
    const topOverlayId = overlayStackIds[overlayStackIds.length - 1];
    if (topOverlayId) {
      toggleOverlayOpenById(topOverlayId);
    }
  }, [overlayStackIds.length, toggleOverlayOpenById]);

  // Decide whether to use explicitly passed prop OR the global context stack
  const isAnyOverlayOpen = React.useMemo(() => {
    return overlayStackIds.length > 0;
  }, [overlayStackIds.length]);

  const overlayRootNode = React.useMemo(() => {
    return typeof window === 'undefined'
      ? null
      : ReactDOMClient.createPortal(
          <div id={OVERLAY_CONTAINER_ID}>
            <Backdrop
              srfBackgroundColor="base"
              bckIsVisible={isAnyOverlayOpen}
              bckOnClick={handleBackdropClick}
            />
          </div>,
          document.body,
        );
  }, [handleBackdropClick, isAnyOverlayOpen]);

  return overlayRootNode;
};

export { OVERLAY_CONTAINER_ID, OverlayContainer };
