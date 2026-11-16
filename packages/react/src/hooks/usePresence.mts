'use client';

import React from 'react';

// Waits this long at most for an exit animation that never reports its end
const EXIT_ANIMATION__MAX_MS = 1000;

/**
 * Keeps an element mounted while it plays its exit animation.
 * Returns `isMounted` (render it) and `state` (`data-state="open" | "closed"`, which starts the
 * enter / exit animation in ui-core CSS). Unmounts on the element's own `animationend`, or
 * right away when it has no animation (reduced motion, the headless `normalize.css`).
 *
 * @example
 * const ref = React.useRef<HTMLDivElement>(null);
 * const { isMounted, state } = usePresence(isOpen, ref);
 * return isMounted && <div ref={ref} data-state={state} className="ms-dialog">…</div>;
 */
function usePresence(
  isOpen: boolean,
  ref: React.RefObject<HTMLElement | null>,
) {
  const [isMounted, setIsMounted] = React.useState(isOpen);

  // NOTE: mounts in the same render that opens it (no extra effect pass)
  if (isOpen && !isMounted) setIsMounted(true);

  React.useEffect(() => {
    if (isOpen || !isMounted) return;

    const node = ref.current;
    const animationName = node ? getComputedStyle(node).animationName : '';
    const hasExitAnimation = Boolean(animationName) && animationName !== 'none';

    if (!node || !hasExitAnimation) {
      setIsMounted(false);
      return;
    }

    const unmount = () => setIsMounted(false);
    const handleAnimationEnd = (event: AnimationEvent) => {
      // NOTE: animations of children bubble up too
      if (event.target === node) unmount();
    };

    const timeoutId = setTimeout(unmount, EXIT_ANIMATION__MAX_MS);

    node.addEventListener('animationend', handleAnimationEnd);
    return () => {
      clearTimeout(timeoutId);
      node.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [isOpen, isMounted, ref]);

  return {
    isMounted,
    state: (isOpen ? 'open' : 'closed') as 'open' | 'closed',
  };
}

export { usePresence };
