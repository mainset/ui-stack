import { Presence } from '@mainset/react/components';
import { Flex } from '@mainset/react/elements';
import { cnx } from '@mainset/ui-core';
import React from 'react';
import ReactDOMClient from 'react-dom';

// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { useMainSet } from '../MainSetContext/MainSetContext.mjs';
import { OVERLAY_CONTAINER_ID } from './OverlayContainer.js';
import { useFocusTrap } from './overlay-hooks/index.mjs';
import * as styles from './overlay.module.scss';

interface OverlayContentProps extends React.PropsWithChildren {
  ovrId: string; // Add id to know if it's the top-most modal
  ovrIsOpen: boolean;
  ovrPlacement?: 'middle' | 'start' | 'end';
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
  children,
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
        className={cnx(styles['ms-overlay__content-positioner'])}
        {...FLEX_PROPS__BY_OVERLAY_PLACEMENT[ovrPlacement]}
      >
        {children}
      </Flex>
    );

    return ReactDOMClient.createPortal(wrappedChildren, overlayRoot);
  }, [children, ovrPlacement]);

  return <Presence prsIsMounted={ovrIsOpen}>{portalNode}</Presence>;
};

export { OverlayContent };
