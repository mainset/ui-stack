'use client';

import type { Placement } from '@floating-ui/react-dom';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import React from 'react';

import { isRtl } from '../../elements/utils/index.mjs';

/** The side of the trigger it opens on: `start` / `end` are inline sides, they follow `dir` */
type FloatingSide = 'top' | 'bottom' | 'start' | 'end';
/** Its alignment along that side (logical too) */
type FloatingAlign = 'start' | 'center' | 'end';

// Kept between the floating element and the viewport edges
const VIEWPORT__PADDING = 8;

function toPlacement(
  side: FloatingSide,
  align: FloatingAlign,
  isReferenceRtl: boolean,
): Placement {
  const physicalSide =
    side === 'start'
      ? isReferenceRtl
        ? 'right'
        : 'left'
      : side === 'end'
        ? isReferenceRtl
          ? 'left'
          : 'right'
        : side;

  // NOTE: Floating UI mirrors `-start` / `-end` itself for an RTL floating element
  return align === 'center' ? physicalSide : `${physicalSide}-${align}`;
}

/**
 * Positions a floating element (popover, tooltip, menu) next to its reference, flipping to the
 * other side and shifting to stay in the viewport. `position: fixed`, so it escapes `overflow`
 * clipping while staying next to its trigger in the DOM (and in the Tab order).
 * Updates on scroll / resize only while open.
 */
function useFloatingPosition({
  isOpen,
  side,
  align,
  distance = 8,
}: {
  isOpen: boolean;
  side: FloatingSide;
  align: FloatingAlign;
  distance?: number;
}) {
  const [isReferenceRtl, setIsReferenceRtl] = React.useState(false);

  const floating = useFloating({
    open: isOpen,
    strategy: 'fixed',
    placement: toPlacement(side, align, isReferenceRtl),
    // NOTE: `top` / `left`, not `transform`: the enter animations scale the element
    transform: false,
    middleware: [
      offset(distance),
      flip({ padding: VIEWPORT__PADDING }),
      shift({ padding: VIEWPORT__PADDING }),
    ],
    whileElementsMounted: isOpen ? autoUpdate : undefined,
  });

  // NOTE: the measured direction of the trigger's own section (a page or a single section)
  const referenceNode = floating.elements.reference;
  React.useLayoutEffect(() => {
    if (isOpen && referenceNode instanceof Element) {
      setIsReferenceRtl(isRtl(referenceNode));
    }
  }, [isOpen, referenceNode]);

  return floating;
}

export { useFloatingPosition };
export type { FloatingAlign, FloatingSide };
