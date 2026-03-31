import React from 'react';

interface PresenceStyleProps extends React.PropsWithChildren {
  /**
   * Determines if the component should be visually present and mounted in the DOM.
   */
  prsIsMounted: boolean;
  /**
   * The delay in milliseconds before the component is completely unmounted.
   * This should match or slightly exceed the duration of your CSS exit animation.
   * @default 300
   */
  prsUnmountDelay?: number;
}

/**
 * A utility component that delays the unmounting of its children.
 * This allows exit CSS animations (opacity, transforms) to complete smoothly
 * before React removes the element from the DOM entirely.
 */
const Presence = ({
  prsIsMounted,
  prsUnmountDelay = 300,
  children,
}: PresenceStyleProps) => {
  const [isMounted, setIsMounted] = React.useState(prsIsMounted);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (prsIsMounted) {
      // Immediately mount when present becomes true
      setIsMounted(true);
    } else if (isMounted) {
      // Delay unmounting when present becomes false to allow exit animations
      timeoutId = setTimeout(() => {
        setIsMounted(false);
      }, prsUnmountDelay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [prsIsMounted, prsUnmountDelay, isMounted]);

  const presenceContent = React.useMemo(() => {
    return isMounted ? children : null;
  }, [isMounted, children]);

  return presenceContent;
};

export { Presence };
