import React from 'react';

/**
 * Stops the page behind an overlay from scrolling. The scrollbar's width is kept as padding at the
 * inline end, so the page doesn't shift sideways (`scrollbar-gutter` is newer than the baseline).
 */
const useGlobalBodyScrollLock = (isLocked: boolean) => {
  React.useEffect(() => {
    if (!isLocked || typeof document === 'undefined') return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const { overflow, paddingInlineEnd } = body.style;
    const computedPadding =
      parseFloat(getComputedStyle(body).paddingInlineEnd) || 0;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingInlineEnd = `${computedPadding + scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = overflow;
      body.style.paddingInlineEnd = paddingInlineEnd;
    };
  }, [isLocked]);
};

export { useGlobalBodyScrollLock };
